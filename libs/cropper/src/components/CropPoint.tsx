import type { FC } from "react";
import { css, cx } from "@emotion/css";
import { tw } from "twind";

const s = 32;
const r = 16;
const size = 32;

// * --------------------------------------------------------------------------- comp

export const CropPoint: FC = () => {
  return (
    <>
      <CornerButton className="cropper-point point-nw" axis={[-1, -1]}>
        <IconNw />
      </CornerButton>

      <CornerButton className="cropper-point point-ne" axis={[1, -1]}>
        <IconNe />
      </CornerButton>

      <CornerButton className="cropper-point point-se" axis={[1, 1]}>
        <IconSe />
      </CornerButton>

      <CornerButton className="cropper-point point-sw" axis={[-1, 1]}>
        <IconSw />
      </CornerButton>
    </>
  );
};

// 暂时只用到四个角

// <span className="cropper-point point-ne" />
// <span className="cropper-point point-nw" />
// <span className="cropper-point point-se" />
// <span className="cropper-point point-sw" />

// <span className="cropper-point point-e" />
// <span className="cropper-point point-n" />
// <span className="cropper-point point-w" />
// <span className="cropper-point point-s" />

const CornerButton: FC<{ axis: [1 | -1, 1 | -1]; className: string }> = ({ axis, className, children }) => {
  const [ax, ay] = axis;
  return (
    <div
      className={cx(className, tw`absolute`, corner)}
      style={{
        [ax === -1 ? "left" : "right"]: `-${size / 2}px`,
        [ay === -1 ? "top" : "bottom"]: `-${size / 2}px`,
      }}
    >
      {children}
    </div>
  );
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
