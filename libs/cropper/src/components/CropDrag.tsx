import type { FC } from "react";
import { cx } from "@emotion/css";
import { tw } from "twind";
import { useMove } from "../hooks/useMove";
import { rafBatch, useValue } from "../utils";
import { cropBoxStore, getCropBox } from "./CropBox";
import { useMemo } from "react";
import { getCropStore } from "@react-image-cropper/cropper";

// * --------------------------------------------------------------------------- serv

const useCropDrag = () => {
  const { naturalWidth: imgWidth, naturalHeight: imgHeight } = useValue(getCropStore);
  const { width: cropWidth, height: cropHeight } = useValue(getCropBox);

  const maxLeft = imgWidth - cropWidth;
  const maxTop = imgHeight - cropHeight;

  const { moveProps } = useMove({
    onMove: ({ deltaX, deltaY }) => {
      rafBatch(() => {
        cropBoxStore.set((data) => {
          const [newTop, newLeft] = [data.top + deltaY, data.left + deltaX];
          const [resTop, resLeft] = [limitPos(newTop, maxTop), limitPos(newLeft, maxLeft)];
          data.top = resTop;
          data.left = resLeft;
        });
      }).then();
    },
  });

  return { moveProps };
};

// * --------------------------------------------------------------------------- comp

export const CropDrag: FC = () => {
  const { moveProps } = useCropDrag();

  return useMemo(() => {
    return (
      <div {...moveProps} className={cx("cropper-face cropper-move", tw`absolute w-full h-full cursor-move inset-0`)} />
    );
  }, [moveProps]);
};

// * --------------------------------------------------------------------------- util

// TODO: 默认画布左上角 top 和 left 为 0，具体的数值用 imageLeft / imageTop 表示更好 // XuYuCheng 2021/08/9
const limitPos = (newVal: number, maxVal: number) => {
  if (newVal < 0) return 0;
  return newVal > maxVal ? maxVal : newVal;
};
