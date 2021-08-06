import type { FC } from "react";

export const CropPoint: FC = () => {
  return (
    <>
      <span className="cropper-point point-e" />
      <span className="cropper-point point-n" />
      <span className="cropper-point point-w" />
      <span className="cropper-point point-s" />
      <span className="cropper-point point-ne" />
      <span className="cropper-point point-nw" />
      <span className="cropper-point point-se" />
      <span className="cropper-point point-sw" />
    </>
  );
};
