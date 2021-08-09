import { FC } from "react";
import { useValue } from "../utils";
import { getCropProps, getCropStore } from "@react-image-cropper/cropper";
import { getCropBox } from "./CropBox";
import { tw } from "twind";
import { css, cx } from "@emotion/css";

// * --------------------------------------------------------------------------- serv

// TODO: calculate scale// XuYuCheng 2021/08/9
const useCropViewer = () => {
  const { src } = useValue(getCropProps);
  const { top, left } = useValue(getCropBox);
  const { naturalWidth, naturalHeight } = useValue(getCropStore);

  const imgStyle = {
    width: naturalWidth,
    height: naturalHeight,
    transform: `translateX(${-left}px) translateY(${-top}px)`,
  };

  return { src, imgStyle };
};

// * --------------------------------------------------------------------------- comp

/**
 * highlight cropped area
 */
export const CropViewer: FC = () => {
  const { src, imgStyle } = useCropViewer();

  return (
    <div className={cx(tw`block overflow-hidden w-full h-full`, imgWrapper)}>
      <img alt="" crossOrigin="anonymous" src={src} style={imgStyle} className={cx(image)} />
    </div>
  );
};

// * --------------------------------------------------------------------------- style

const imgWrapper = css`
  outline: 2px solid #01d9e1;
`;

// prevent img tag width out of shape
const image = css`
  display: block;
  height: 100%;
  image-orientation: 0deg;
  max-height: none !important;
  max-width: none !important;
  min-height: 0 !important;
  min-width: 0 !important;
  width: 100%;
`;
