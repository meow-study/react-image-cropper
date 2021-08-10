import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getTransformStyle, rafBatch, store, useValue } from "../utils";
import { cropStore, getCropProps, getCropStore } from "@react-image-cropper/cropper";
import { tw } from "twind";
import { css, cx } from "@emotion/css";
import { getContainerSize } from "./Container";

// * --------------------------------------------------------------------------- type

interface NaturalSizeType {
  width: number;
  height: number;
}

// * --------------------------------------------------------------------------- store

export const originImageStore = store({
  width: NaN,
  height: NaN,
});
export const getOriginImage = () => originImageStore.get();

// * --------------------------------------------------------------------------- serv

const useImageNaturalSize = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState<NaturalSizeType>({
    width: 0,
    height: 0,
  });

  const handleOnLoad = () => {
    const img = imgRef.current;
    if (img) {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    }
  };

  const { isVertical } = useValue(getCropStore);

  // share image size info to store
  // TODO: remove it // XuYuCheng 2021/08/10
  useEffect(() => {
    const { width, height } = naturalSize;

    rafBatch(() => {
      cropStore.set((data) => {
        data.naturalWidth = isVertical ? height : width;
        data.naturalHeight = isVertical ? width : height;
        data.aspectRatio = width / height;
      });
      originImageStore.set((data) => {
        data.width = width;
        data.height = height;
      });
    }).then();
  }, [isVertical, naturalSize]);

  // image is ready
  useEffect(() => {
    const { width, height } = naturalSize;
    if (width !== 0 || height !== 0) {
      rafBatch(() => {
        cropStore.set((data) => {
          data.ready = true;
        });
      }).then();
    }
  }, [naturalSize]);

  return { imgRef, naturalSize, handleOnLoad };
};

// * ---------------------------

const useImageSize = () => {
  const container = useValue(getContainerSize);
  const { isVertical } = useValue(getCropStore);
  const { rotate, scaleX, scaleY } = useValue(getCropProps);
  const { imgRef, naturalSize, handleOnLoad } = useImageNaturalSize();

  const { width: originWidth, height: originHeight } = naturalSize;
  const width = isVertical ? originHeight : originWidth;
  const height = isVertical ? originWidth : originHeight;

  const style = useMemo(() => {
    if (!container) return;
    return {
      width,
      height,
      transform: `rotate(${isVertical ? 90 : 0})`,
    };
  }, [container, height, isVertical, width]);

  const imgStyle = useMemo(() => {
    return {
      transformOrigin: "0 0",
      transform: getTransformStyle({ width, height, rotate, scaleX, scaleY }),
    };
  }, [height, rotate, scaleX, scaleY, width]);

  return { style, imgStyle, imgRef, handleOnLoad };
};

// * ---------------------------

const useImage = () => {
  const { style, imgStyle, imgRef, handleOnLoad } = useImageSize();
  const { src } = useValue(getCropProps);

  return { src, imgStyle, imgRef, style, handleOnLoad };
};

// * --------------------------------------------------------------------------- comp

export const Image: FC = () => {
  const { src, imgStyle, imgRef, style, handleOnLoad } = useImage();

  return useMemo(() => {
    return (
      <div className={cx("cropper-canvas", tw`absolute`, canvas)} style={style}>
        {style && <img alt="" src={src} ref={imgRef} onLoad={handleOnLoad} style={imgStyle} className={cx(image)} />}
        <div className={cx(tw`absolute inset-0`, skin)} />
      </div>
    );
  }, [handleOnLoad, imgRef, imgStyle, src, style]);
};

// * --------------------------------------------------------------------------- style

const canvas = css`
  background-color: transparent;
`;

const skin = css`
  background-color: rgba(255, 255, 255, 0.5);
`;

const image = css`
  display: block;
  image-orientation: 0deg;
  max-height: none !important;
  max-width: none !important;
  min-height: 0 !important;
  min-width: 0 !important;
`;
