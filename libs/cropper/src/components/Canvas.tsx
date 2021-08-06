import type { FC } from "react";

export const Canvas: FC = () => {
  return (
    <div className="cropper-wrapper">
      <div className="cropper-canvas">
        <img alt="" />
      </div>
    </div>
  );
};
