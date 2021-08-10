import type { FC } from "react";
import { css, cx } from "@emotion/css";
import { tw } from "twind";
import { useMove } from "../hooks/useMove";
import { rafBatch, useValue } from "../utils";
import { cropBoxStore, getCropBox } from "./CropBox";
import { getCropStore } from "@react-image-cropper/cropper";

// * --------------------------------------------------------------------------- constant

export const MIN_CROP_LENGTH = 20;

// * --------------------------------------------------------------------------- serv

// TODO: 这里的代码写得太屎了，使用线代简化计算// XuYuCheng 2021/08/9
// TODO: left 和 top 拖动会有抖动（抖归抖，拖拽性能居然不错，很跟手）// XuYuCheng 2021/08/9

const useCropLineMove = (direction: "left" | "top" | "right" | "bottom") => {
  const { naturalWidth: imgWidth, naturalHeight: imgHeight } = useValue(getCropStore);
  const { width: cropWidth, height: cropHeight, top: cropTop, left: cropLeft } = useValue(getCropBox);

  const { moveProps } = useMove({
    onMove: ({ deltaX, deltaY }) => {
      rafBatch(() => {
        cropBoxStore.set((data) => {
          if (direction === "left") {
            const [minLeft, minWidth] = [0, MIN_CROP_LENGTH];
            const [maxLeft, maxWidth] = [cropLeft + cropWidth - MIN_CROP_LENGTH, cropLeft + cropWidth];
            const [newLeft, newWidth] = [data.left + deltaX, data.width - deltaX];
            const [resLeft, resWidth] = [limitSize(newLeft, minLeft, maxLeft), limitSize(newWidth, minWidth, maxWidth)];
            data.left = resLeft;
            data.width = resWidth;
          }

          if (direction === "top") {
            const [minTop, minHeight] = [0, MIN_CROP_LENGTH];
            const [maxTop, maxHeight] = [cropTop + cropHeight - MIN_CROP_LENGTH, cropTop + cropHeight];
            const [newTop, newHeight] = [data.top + deltaY, data.height - deltaY];
            const [resTop, resHeight] = [limitSize(newTop, minTop, maxTop), limitSize(newHeight, minHeight, maxHeight)];
            data.top = resTop;
            data.height = resHeight;
          }

          if (direction === "right") {
            const minWidth = MIN_CROP_LENGTH;
            const maxWidth = imgWidth - cropLeft;
            const newWidth = data.width + deltaX;
            data.width = limitSize(newWidth, minWidth, maxWidth);
          }
          if (direction === "bottom") {
            const minHeight = MIN_CROP_LENGTH;
            const maxHeight = imgHeight - cropTop;
            const newHeight = data.height + deltaY;
            data.height = limitSize(newHeight, minHeight, maxHeight);
          }
        });
      }).then();
    },
  });

  return { moveProps };
};

// * --------------------------------------------------------------------------- comp

// TODO: 这里可以优化成 list.map => comp 的形式，但是代码相差不大 // XuYuCheng 2021/08/9

export const CropLine: FC = () => {
  const { moveProps: moveLeftProps } = useCropLineMove("left");
  const { moveProps: moveTopProps } = useCropLineMove("top");
  const { moveProps: moveRightProps } = useCropLineMove("right");
  const { moveProps: moveBottomProps } = useCropLineMove("bottom");

  return (
    <>
      <span className={cx("cropper-line line-w", cropperLine, line)} {...moveLeftProps} />
      <span className={cx("cropper-line line-n", cropperLine, line)} {...moveTopProps} />
      <span className={cx("cropper-line line-e", cropperLine, line)} {...moveRightProps} />
      <span className={cx("cropper-line line-s", cropperLine, line)} {...moveBottomProps} />
    </>
  );
};

// * --------------------------------------------------------------------------- util

export const limitSize = (val: number, min: number, max: number) => (val < min ? min : val > max ? max : val);

// * --------------------------------------------------------------------------- style

const cropperLine = tw`block absolute h-full w-full opacity-10`;

const line = css`
  background-color: #01d9e1;

  &.line-e {
    width: 5px;

    cursor: ew-resize;
    top: 0;
    right: -3px;
  }

  &.line-n {
    height: 5px;

    cursor: ns-resize;
    top: -3px;
    left: 0;
  }

  &.line-w {
    width: 5px;

    cursor: ew-resize;
    top: 0;
    left: -3px;
  }

  &.line-s {
    height: 5px;

    cursor: ns-resize;
    bottom: -3px;
    left: 0;
  }
`;
