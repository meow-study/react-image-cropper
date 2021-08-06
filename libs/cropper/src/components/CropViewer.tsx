import { FC } from "react";
import { useCropDrag } from "../hooks/useCropDrag";
import { useCropResize } from "../hooks/useCropResize";

// * ---------------------------

/**
 * highlight cropped area
 */
export const CropViewer: FC = () => {
  const dragOptions = useCropDrag();
  const resizeOptions = useCropResize();

  console.log(dragOptions, resizeOptions, 11111111);

  return <div>123123</div>;
};
