import type { FC } from "react";
import { css, cx } from "@emotion/css";

// * --------------------------------------------------------------------------- comp

export const CropDashed: FC = () => {
  return (
    <>
      <span className={cx("cropper-dashed dashed-h", dashedStyle, hDashedStyle)} />
      <span className={cx("cropper-dashed dashed-v", dashedStyle, vDashedStyle)} />
    </>
  );
};

// * --------------------------------------------------------------------------- style

const hDashedStyle = css`
  border-bottom-width: 1px;
  border-top-width: 1px;
  height: calc(100% / 3);
  left: 0;
  top: calc(100% / 3);
  width: 100%;
`;

const vDashedStyle = css`
  border-left-width: 1px;
  border-right-width: 1px;
  height: 100%;
  left: calc(100% / 3);
  top: 0;
  width: calc(100% / 3);
`;

const dashedStyle = css`
  border: 0 dashed #eee;
  display: block;
  opacity: 0.5;
  position: absolute;
`;
