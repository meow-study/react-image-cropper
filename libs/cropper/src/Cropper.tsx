import type { FC } from "react";
import { getOriginImage, Image } from "./components/Image";
import { rafBatch, store, useValue } from "./utils";
import { useEffect } from "react";
import { CropBox } from "./components/CropBox";
import { Container } from "./components/Container";
import { removeEmpty } from "./utils/convert/removeEmpty";

// * --------------------------------------------------------------------------- store

export const cropStore = store<CropperStoreType>({
  ready: false, // 图片是否加载完成
  val: "12312312",
  isVertical: false,
  originalUrl: "",
  naturalWidth: 0,
  naturalHeight: 0,
  aspectRatio: NaN,
});
export const getCropStore = () => cropStore.get();

// * ---------------------------

export const defaultProps: CropperProps = {
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
  scaleX?: 1 | -1;
  scaleY?: 1 | -1;
  rotate?: 0 | 90 | -90 | 180; // 目前不支持灵活旋转
  scalable?: boolean;
  rotatable?: boolean;
  background?: boolean;
  checkOrientation?: boolean;
}

export interface CropperStoreType {
  ready: boolean; // 图片是否加载完成
  val: string;
  isVertical: boolean;
  originalUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: number;
}

// * --------------------------------------------------------------------------- comp

export const Cropper: FC<CropperProps> = ({ children: _, ...props }) => {
  const { width: originWidth, height: originHeight } = useValue(getOriginImage);

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
          data.isVertical = props.rotate === 90 || props.rotate === -90;
        });
      }).then();
    }
  }, [props]);

  useEffect(() => {
    const isVertical = props.rotate === 90 || props.rotate === -90;
    if (!isNaN(originWidth) && !isNaN(originHeight)) {
      rafBatch(() => {
        cropStore.set((data) => {
          data.naturalWidth = isVertical ? originHeight : originWidth;
          data.naturalHeight = isVertical ? originWidth : originHeight;
        });
      });
    }
  }, [originHeight, originWidth, props.rotate]);

  // * ---------------------------

  return (
    <Container>
      <Image />
      <CropBox />
    </Container>
  );
};
