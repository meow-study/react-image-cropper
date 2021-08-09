import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { rafBatch, useValue } from "../utils";
import { cropStore, getCropProps } from "@react-image-cropper/cropper";
import { tw } from "twind";
import { css, cx } from "@emotion/css";
import { getContainerSize } from "./Container";

// * --------------------------------------------------------------------------- type

interface NaturalSizeType {
  width: number;
  height: number;
}

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

  // share image size info to store
  useEffect(() => {
    const { width, height } = naturalSize;

    rafBatch(() => {
      cropStore.set((data) => {
        data.naturalWidth = width;
        data.naturalHeight = height;
        data.aspectRatio = width / height;
      });
    }).then();
  }, [naturalSize]);

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
  const { imgRef, naturalSize, handleOnLoad } = useImageNaturalSize();

  const style = useMemo(() => {
    if (!container) return;

    const { width, height } = naturalSize;
    return {
      width,
      height,
    };
  }, [container, naturalSize]);

  return { style, imgRef, handleOnLoad };
};

// * ---------------------------

const useImage = () => {
  const { style, imgRef, handleOnLoad } = useImageSize();
  const { src } = useValue(getCropProps);

  return { src, imgRef, style, handleOnLoad };
};

// * --------------------------------------------------------------------------- comp

export const Image: FC = () => {
  const { src, imgRef, style, handleOnLoad } = useImage();

  return useMemo(() => {
    return (
      <div className={cx("cropper-canvas", tw`absolute`, image)} style={style}>
        {style && <img alt="" src={src} ref={imgRef} onLoad={handleOnLoad} />}
        <div className={cx(tw`absolute inset-0`, skin)} />
      </div>
    );
  }, [handleOnLoad, imgRef, src, style]);
};

// * --------------------------------------------------------------------------- style

const image = css`
  background-color: transparent;
`;

const skin = css`
  background-color: rgba(255, 255, 255, 0.5);
`;
