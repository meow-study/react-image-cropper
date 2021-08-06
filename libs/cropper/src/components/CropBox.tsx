import type { FC } from "react";
import { CropViewer } from "./CropViewer";
import { CropDashed } from "./CropDashed";
import { CropCenter } from "./CropCenter";
import { CropFace } from "./CropFace";
import { CropLine } from "./CropLine";
import { CropPoint } from "./CropPoint";

export const CropBox: FC = () => {
  return (
    <div className="cropper-crop-box">
      <CropViewer />
      <CropDashed />
      <CropCenter />
      <CropFace />
      <CropLine />
      <CropPoint />
    </div>
  );
};
