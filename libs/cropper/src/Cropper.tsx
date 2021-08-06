import type { FC } from "react";
import { Image } from "./components/Image";
import { Canvas } from "./components/Canvas";
import { isJpegURL, rafBatch, store } from "./utils";
import { useEffect } from "react";
import { CropBox } from "./components/CropBox";

// * --------------------------------------------------------------------------- store

export const cropStore = store({
  val: "12312312",
  originalUrl: "",
  naturalWidth: NaN,
  naturalHeight: NaN,
  aspectRatio: NaN,
});
export const getCropStore = () => cropStore.get();

export const cropProps = store<CropperProps>({
  src: "",
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
  scalable: true,
  rotatable: true,
  checkOrientation: true,
});
export const getCropProps = () => cropProps.get();

// * --------------------------------------------------------------------------- inter

export interface CropperProps {
  src?: string;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  scalable?: boolean;
  rotatable?: boolean;
  checkOrientation?: boolean;
}

// * --------------------------------------------------------------------------- comp

export const Cropper: FC<CropperProps> = (props) => {
  const { src, rotate = 0, scaleX = 1, scaleY = 1, scalable = true, rotatable = true } = props;

  // * --------------------------- sync props to store

  useEffect(() => {
    if (src) {
      rafBatch(() => {
        cropStore.set((data) => {
          data.originalUrl = src;
        });
      }).then();
    }
  }, [src]);

  useEffect(() => {
    rafBatch(() => {
      cropProps.set((data) => {
        if (!rotatable && !scalable) {
          data.checkOrientation = false;
        }
      });
    }).then();
  }, [rotatable, scalable]);

  useEffect(() => {
    if (src) {
      console.log(isJpegURL(src), "-----------------");
    }
  }, [src]);

  useEffect(() => {
    rafBatch(() => {
      cropProps.set((data) => {
        data.scaleX = scaleX;
        data.scaleY = scaleY;
        data.rotate = rotate;
      });
    }).then();
  }, [rotate, scaleX, scaleY]);

  // * ---------------------------

  return (
    <>
      <Image src={src} />
      <div className="cropper-container">
        <Canvas />
        <CropBox />
      </div>
    </>
  );
};
