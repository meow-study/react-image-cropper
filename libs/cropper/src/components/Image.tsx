import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { rafBatch, useValue } from "../utils";
import { cropStore, getCropStore } from "@react-image-cropper/cropper";
import { tw } from "twind";

// * --------------------------------------------------------------------------- type

interface NaturalSizeType {
  width: number;
  height: number;
}

// * --------------------------------------------------------------------------- comp

/**
 * used to init image data, do not display
 */
export const Image: FC<{ src?: string }> = ({ src }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState<NaturalSizeType>({
    width: NaN,
    height: NaN,
  });

  const handleOnLoad = () => {
    const img = imgRef.current;
    if (img) {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    }
  };

  useEffect(() => {
    const { width, height } = naturalSize;

    if (!isNaN(width) && !isNaN(height)) {
      rafBatch(() => {
        cropStore.set((data) => {
          data.naturalWidth = width;
          data.naturalHeight = height;
          data.aspectRatio = width / height;
        });
      }).then();
    }
  }, [naturalSize]);

  // * --------------------------- test

  const url = useValue(getCropStore);
  useEffect(() => {
    console.log(url, 33333);
  }, [url]);

  return (
    <img
      alt=""
      src={src}
      ref={imgRef}
      onLoad={handleOnLoad}
      style={{ zIndex: -1 }}
      className={tw`absolute top-0 left-0 max-w-0 max-h-0 min-w-0 min-h-0 opacity-0`}
    />
  );
};
