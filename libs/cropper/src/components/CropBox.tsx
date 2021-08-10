import type { FC } from "react";
import { CropViewer } from "./CropViewer";
import { CropDashed } from "./CropDashed";
import { CropCenter } from "./CropCenter";
import { CropDrag } from "./CropDrag";
import { CropLine } from "./CropLine";
import { CropPoint } from "./CropPoint";
import { css, cx } from "@emotion/css";
import { store, useValue } from "../utils";
import { tw } from "twind";

// * --------------------------------------------------------------------------- type

export interface CropBoxSizeType {
  top: number;
  left: number;
  width: number;
  height: number;
}

// * --------------------------------------------------------------------------- store

// TODO: remove mockData// XuYuCheng 2021/08/9
const mockCropBox: CropBoxSizeType = { top: 100, left: 100, width: 400, height: 200 };

// TODO: 初始值为百分之 80（根据图片宽高和百分比计算出的 size 值） // XuYuCheng 2021/08/9
export const cropBoxStore = store<CropBoxSizeType>(mockCropBox);
export const getCropBox = () => cropBoxStore.get();

// * --------------------------------------------------------------------------- serv

const useCropBox = () => {
  const { top, left, width, height } = useValue(getCropBox);
  // transform 会造成抖动
  // return { width, height, left, top, transform: `translateX(${left}px) translateY(${top}px)` };
  return { width, height, left, top };
};

// * --------------------------------------------------------------------------- comp

export const CropBox: FC = () => {
  const cropSizeStyle = useCropBox();

  return (
    <div className={cx("cropper-crop-box", tw`absolute`, cropBox)} style={cropSizeStyle}>
      <CropViewer />
      <CropDashed />
      <CropCenter />
      <CropDrag />
      <CropLine />
      <CropPoint />
    </div>
  );
};

// * --------------------------------------------------------------------------- style

const cropBox = css`
  z-index: 1;
  -webkit-font-smoothing: subpixel-antialiased;
  -webkit-transform: translateZ(0) scale(1, 1);
`;
