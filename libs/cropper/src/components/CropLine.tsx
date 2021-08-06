import type { FC } from "react";

export const CropLine: FC = () => {
  return (
    <>
      <span className="cropper-line line-e" />
      <span className="cropper-line line-n" />
      <span className="cropper-line line-w" />
      <span className="cropper-line line-s" />
    </>
  );
};
