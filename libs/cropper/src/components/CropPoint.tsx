import type { FC } from "react";
import { css, cx } from "@emotion/css";
import { tw } from "twind";
import { useMove } from "../hooks/useMove";
import { rafBatch, useValue } from "../utils";
import { getCropStore } from "@react-image-cropper/cropper";
import { cropBoxStore, getCropBox } from "./CropBox";
import { useMemo } from "react";
import { limitSize, MIN_CROP_LENGTH } from "./CropLine";

type PointDirectionType = "nw" | "ne" | "se" | "sw";

// * --------------------------------------------------------------------------- constants

const s = 32;
const r = 16;
const size = 32;

// * --------------------------------------------------------------------------- serv

// TODO: 这里的代码写得太屎了，使用线代简化计算// XuYuCheng 2021/08/9
const useCropPointMove = (direction: PointDirectionType) => {
  const { naturalWidth: imgWidth, naturalHeight: imgHeight } = useValue(getCropStore);
  const { width, height, top, left } = useValue(getCropBox);

  const { moveProps } = useMove({
    onMove: ({ deltaX, deltaY }) => {
      rafBatch(() => {
        cropBoxStore.set((data) => {
          if (direction === "nw") {
            const [minLeft, minTop, minWidth, minHeight] = [0, 0, MIN_CROP_LENGTH, MIN_CROP_LENGTH];
            const [maxLeft, maxTop, maxWidth, maxHeight] = [
              left + width - MIN_CROP_LENGTH,
              top + height - MIN_CROP_LENGTH,
              left + width,
              top + height,
            ];
            const [newLeft, newTop, newWidth, newHeight] = [
              data.left + deltaX,
              data.top + deltaY,
              data.width - deltaX,
              data.height - deltaY,
            ];
            const [resLeft, resTop, resWidth, resHeight] = [
              limitSize(newLeft, minLeft, maxLeft),
              limitSize(newTop, minTop, maxTop),
              limitSize(newWidth, minWidth, maxWidth),
              limitSize(newHeight, minHeight, maxHeight),
            ];
            data.top = resTop;
            data.left = resLeft;
            data.width = resWidth;
            data.height = resHeight;
          }

          if (direction === "ne") {
            const [minTop, minWidth, minHeight] = [0, MIN_CROP_LENGTH, MIN_CROP_LENGTH];
            const [maxTop, maxWidth, maxHeight] = [top + height - MIN_CROP_LENGTH, imgWidth - left, height + top];
            const [newTop, newWidth, newHeight] = [data.top + deltaY, data.width + deltaX, data.height - deltaY];
            const [resTop, resWidth, resHeight] = [
              limitSize(newTop, minTop, maxTop),
              limitSize(newWidth, minWidth, maxWidth),
              limitSize(newHeight, minHeight, maxHeight),
            ];
            data.top = resTop;
            data.width = resWidth;
            data.height = resHeight;
          }

          if (direction === "se") {
            const [minWidth, minHeight] = [MIN_CROP_LENGTH, MIN_CROP_LENGTH];
            const [maxWidth, maxHeight] = [imgWidth - left, imgHeight - top];
            const [newWidth, newHeight] = [data.width + deltaX, data.height + deltaY];
            const [resWidth, resHeight] = [
              limitSize(newWidth, minWidth, maxWidth),
              limitSize(newHeight, minHeight, maxHeight),
            ];
            data.width = resWidth;
            data.height = resHeight;
          }

          if (direction === "sw") {
            const [minLeft, minWidth, minHeight] = [0, MIN_CROP_LENGTH, MIN_CROP_LENGTH];
            const [maxLeft, maxWidth, maxHeight] = [left + width - MIN_CROP_LENGTH, left + width, imgHeight - top];
            const [newLeft, newWidth, newHeight] = [data.left + deltaX, data.width - deltaX, data.height + deltaY];
            const [resLeft, resWidth, resHeight] = [
              limitSize(newLeft, minLeft, maxLeft),
              limitSize(newWidth, minWidth, maxWidth),
              limitSize(newHeight, minHeight, maxHeight),
            ];
            data.left = resLeft;
            data.width = resWidth;
            data.height = resHeight;
          }
        });
      }).then();
    },
  });
  return { moveProps };
};

// * --------------------------------------------------------------------------- comp

export const CropPoint: FC = () => {
  return useMemo(() => {
    return (
      <>
        <CornerButton className="cropper-point point-nw" axis={[-1, -1]} direction="nw">
          <IconNw />
        </CornerButton>

        <CornerButton className="cropper-point point-ne" axis={[1, -1]} direction="ne">
          <IconNe />
        </CornerButton>

        <CornerButton className="cropper-point point-se" axis={[1, 1]} direction="se">
          <IconSe />
        </CornerButton>

        <CornerButton className="cropper-point point-sw" axis={[-1, 1]} direction="sw">
          <IconSw />
        </CornerButton>
      </>
    );
  }, []);
};

// * ---------------------------

const CornerButton: FC<{
  axis: [1 | -1, 1 | -1];
  className: string;
  direction: PointDirectionType;
}> = ({ axis, className, direction, children }) => {
  const [ax, ay] = axis;
  const { moveProps } = useCropPointMove(direction);

  return useMemo(() => {
    return (
      <div
        {...moveProps}
        className={cx(className, tw`absolute`, corner)}
        style={{
          [ax === -1 ? "left" : "right"]: `-${size / 2}px`,
          [ay === -1 ? "top" : "bottom"]: `-${size / 2}px`,
        }}
      >
        {children}
      </div>
    );
  }, [ax, ay, children, className, moveProps]);
};

// * --------------------------------------------------------------------------- ico

const IconNw = () => (
  <svg viewBox="0 0 32 32">
    <path d={`M${16 + r} ${r}L${r} ${r}L${r} ${16 + r}`} className={p2} />
    <path d={`M${14 + r} ${r}L${r} ${r}L${r} ${14 + r}`} className={p1} />
  </svg>
);

const IconNe = () => (
  <svg viewBox="0 0 32 32">
    <path d={`M${r - 16} ${r}L${s - r} ${r}L${s - r} ${16 + r}`} className={p2} />
    <path d={`M${r - 14} ${r}L${s - r} ${r}L${s - r} ${14 + r}`} className={p1} />
  </svg>
);

const IconSw = () => (
  <svg viewBox="0 0 32 32">
    <path d={`M${r} ${r - 16}L${r} ${s - r}L${16 + r} ${s - r}`} className={p2} />
    <path d={`M${r} ${r - 14}L${r} ${s - r}L${14 + r} ${s - r}`} className={p1} />
  </svg>
);

const IconSe = () => (
  <svg viewBox="0 0 32 32">
    <path d={`M${r - 16} ${s - r}L${s - r} ${s - r}L${s - r} ${r - 16}`} className={p2} />
    <path d={`M${r - 14} ${s - r}L${s - r} ${s - r}L${s - r} ${r - 14}`} className={p1} />
  </svg>
);

// * --------------------------------------------------------------------------- style

/* eslint-disable max-lines */
const p2 = css`
  stroke: hsla(0, 0%, 0%, 0.2);
  stroke-width: 7;
`;

const p1 = css`
  stroke: white;
  stroke-width: 3;
`;

const corner = css`
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  overflow: hidden;
  svg {
    width: 100%;
    height: 100%;
    fill: none;
  }
  &.point-nw {
    cursor: nwse-resize;
  }
  &.point-ne {
    cursor: nesw-resize;
  }
  &.point-se {
    cursor: nwse-resize;
  }
  &.point-sw {
    cursor: nesw-resize;
  }
`;
