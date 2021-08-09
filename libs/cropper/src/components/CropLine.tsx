import type { FC } from "react";
import { css, cx } from "@emotion/css";
import { tw } from "twind";

// * --------------------------------------------------------------------------- comp

export const CropLine: FC = () => {
  return (
    <>
      <span className={cx("cropper-line line-e", cropperLine, line)} />
      <span className={cx("cropper-line line-n", cropperLine, line)} />
      <span className={cx("cropper-line line-w", cropperLine, line)} />
      <span className={cx("cropper-line line-s", cropperLine, line)} />
    </>
  );
};

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
