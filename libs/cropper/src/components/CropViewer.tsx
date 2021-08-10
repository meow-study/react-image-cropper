import { FC } from "react";
import { getTransformStyle, useValue } from "../utils";
import { getCropProps, getCropStore } from "@react-image-cropper/cropper";
import { getCropBox } from "./CropBox";
import { tw } from "twind";
import { css, cx } from "@emotion/css";
import { getOriginImage } from "./Image";

// * --------------------------------------------------------------------------- serv

const useCropViewer = () => {
  const { src } = useValue(getCropProps);
  const { isVertical } = useValue(getCropStore);

  const { top, left } = useValue(getCropBox);
  const { rotate, scaleX, scaleY } = useValue(getCropProps);
  const { width: originWidth, height: originHeight } = useValue(getOriginImage);
  const width = isVertical ? originHeight : originWidth;
  const height = isVertical ? originWidth : originHeight;

  const imgStyle = {
    transformOrigin: `0 0`,
    transform: getTransformStyle({ width, height, rotate, scaleX, scaleY, crop: { top, left } }),
  };

  return { src, imgStyle };
};

// * --------------------------------------------------------------------------- comp

export const CropViewer: FC = () => {
  const { src, imgStyle } = useCropViewer();

  return (
    <span className={cx(tw`block overflow-hidden w-full h-full`, imgWrapper)}>
      <img alt="" crossOrigin="anonymous" src={src} style={imgStyle} className={cx(image)} />
    </span>
  );
};

// * --------------------------------------------------------------------------- style

const imgWrapper = css`
  outline: 2px solid #01d9e1;
`;

const image = css`
  display: block;
  image-orientation: 0deg;
  max-height: none !important;
  max-width: none !important;
  min-height: 0 !important;
  min-width: 0 !important;
`;
