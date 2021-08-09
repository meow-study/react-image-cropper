import type { FC } from "react";
import { css, cx } from "@emotion/css";

export const CropCenter: FC = () => {
  return <span className={cx("cropper-center", center)} />;
};

// * --------------------------------------------------------------------------- style

const center = css`
  display: block;
  height: 0;
  left: 50%;
  opacity: 0.75;
  position: absolute;
  top: 50%;
  width: 0;
  &::before {
    height: 1px;
    left: -3px;
    top: 0;
    width: 7px;
  }
  &::after {
    height: 7px;
    left: 0;
    top: -3px;
    width: 1px;
  }
  &::before,
  &::after {
    background-color: #eee;
    content: " ";
    display: block;
    position: absolute;
  }
`;
