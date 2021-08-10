import { Cropper } from "@react-image-cropper/cropper";
import { css, cx } from "@emotion/css";
import { tw } from "twind";
/* eslint-disable-next-line */
import styles from "./app.module.css";
import { FC, useState } from "react";

const mockUrl = "https://picsum.photos/id/1000/1200/800";
// const mockUrl = "https://picsum.photos/id/1000/800/1200";

// * --------------------------------------------------------------------------- comp

export type RotateType = 90 | -90 | 0 | 180;

export const App = () => {
  const [rotate, setRotate] = useState<RotateType>(0);
  const [scaleX, setScaleX] = useState<-1 | 1>(1);
  const [scaleY, setScaleY] = useState<-1 | 1>(1);
  const rotateList: RotateType[] = [0, 90, 180, -90];

  return (
    <div className={cx(tw`w-screen h-screen flex items-center justify-center overflow-hidden flex-col`, layout)}>
      <div className={tw`flex my-4`}>
        {rotateList.map((value, index) => (
          <Button key={index} onClick={() => setRotate(value)} active={rotate === value}>
            {value}
          </Button>
        ))}
        <Button onClick={() => setScaleX(1)} active={scaleX === 1}>
          scaleX: 1
        </Button>
        <Button onClick={() => setScaleX(-1)} active={scaleX === -1}>
          scaleX: -1
        </Button>
        <Button onClick={() => setScaleY(1)} active={scaleY === 1}>
          scaleY: 1
        </Button>
        <Button onClick={() => setScaleY(-1)} active={scaleY === -1}>
          scaleY: -1
        </Button>
      </div>
      <div className={cx(tw`overflow-auto`, cropperWrapper)}>
        <Cropper src={mockUrl} rotate={rotate} scaleX={scaleX} scaleY={scaleY} />
      </div>
    </div>
  );
};

const Button: FC<{ onClick: () => void; active: boolean }> = ({ children, onClick, active }) => (
  <button className={cx(tw`mx-10 my-4 w-20 ${active ? "border" : undefined}`, btn)} onClick={onClick}>
    {children}
  </button>
);

// * --------------------------------------------------------------------------- style

const btn = css`
  border-color: #24292e;
`;

const layout = css`
  background-color: #eee;
`;

const cropperWrapper = css`
  background-color: #fff;
  margin-left: 300px;
  margin-right: 300px;
  height: 700px;
  width: 1000px;
`;
