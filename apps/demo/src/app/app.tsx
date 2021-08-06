import { Cropper } from "@react-image-cropper/cropper";
import { css, cx } from "@emotion/css";
import { tw } from "twind";
/* eslint-disable-next-line */
import styles from "./app.module.css";

const mockUrl = "https://picsum.photos/id/1000/1200/600";

// * --------------------------------------------------------------------------- comp

export const App = () => {
  return (
    <div className={cx(tw`w-screen h-screen flex pt-2 items-center justify-center overflow-hidden`, layout)}>
      <div className={cx(tw`overflow-auto`, cropperWrapper)}>
        <Cropper src={mockUrl} />
      </div>
    </div>
  );
};

// * --------------------------------------------------------------------------- style

const layout = css`
  background-color: #eee;
`;

const cropperWrapper = css`
  background-color: #fff;
  width: 800px;
  height: 700px;
`;
