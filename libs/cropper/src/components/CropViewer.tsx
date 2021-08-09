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

  return <div />;
};
