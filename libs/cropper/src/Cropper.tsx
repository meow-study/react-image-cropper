import type { FC } from "react";
import { Image } from "./components/Image";
import { Canvas } from "./components/Canvas";
import { rafBatch, store } from "./utils";
import { useEffect } from "react";
import { CropBox } from "./components/CropBox";
import { Container } from "./components/Container";
import { removeEmpty } from "./utils/convert/removeEmpty";

// * --------------------------------------------------------------------------- store

export const cropStore = store<CropperStoreType>({
  ready: false, // 图片是否加载完成
  val: "12312312",
  originalUrl: "",
  naturalWidth: NaN,
  naturalHeight: NaN,
  aspectRatio: NaN,
});
export const getCropStore = () => cropStore.get();

// * ---------------------------

export const defaultProps = {
  src: "",
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
  scalable: true,
  rotatable: true,
  checkOrientation: true,
};
export const cropProps = store<CropperProps>(defaultProps);
export const getCropProps = () => cropProps.get();

// * --------------------------------------------------------------------------- inter

export interface CropperProps {
  src?: string;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  scalable?: boolean;
  rotatable?: boolean;
  background?: boolean;
  checkOrientation?: boolean;
}

export interface CropperStoreType {
  ready: boolean; // 图片是否加载完成
  val: string;
  originalUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: number;
}

// * --------------------------------------------------------------------------- comp

export const Cropper: FC<CropperProps> = ({ children: _, ...props }) => {
  // sync props to store
  useEffect(() => {
    if (props.src) {
      rafBatch(() => {
        const newProps: CropperProps = props;
        removeEmpty(newProps);

        let checkOrientation = true;
        if (!props.rotatable && !props.scalable) {
          checkOrientation = false;
        }

        const result = { ...defaultProps, ...newProps, checkOrientation };
        cropProps.set(result);
        cropStore.set((data) => {
          data.originalUrl = props.src as string;
        });
      }).then();
    }
  }, [props]);

  // * ---------------------------

  return (
    <Container>
      <Canvas />
      <Image />
      <CropBox />
    </Container>
  );
};
