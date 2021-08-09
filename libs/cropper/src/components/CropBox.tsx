import type { FC } from "react";
import { CropViewer } from "./CropViewer";
import { CropDashed } from "./CropDashed";
import { CropCenter } from "./CropCenter";
import { CropFace } from "./CropFace";
import { CropLine } from "./CropLine";
import { CropPoint } from "./CropPoint";
import { tw } from "twind";
import { css, cx } from "@emotion/css";

export const CropBox: FC = () => {
  return (
    <div className={cx("cropper-crop-box", tw`inset-0 absolute`, cropBox)}>
      <CropViewer />
      <CropDashed />
      <CropCenter />
      <CropFace />
      <CropLine />
      <CropPoint />
    </div>
  );
};

// * --------------------------------------------------------------------------- style

const cropBox = css`
  border: 1px solid red;
`;
