import { tw } from "twind";
import { css } from "@emotion/css";
import cx from "classnames";

/* eslint-disable-next-line */
export interface CropperProps {}

export const Cropper = (props: CropperProps) => {
  console.log(props);

  return (
    <div className={cx(tw`flex`, style)}>
      <h1>Welcome to Cropper!</h1>
    </div>
  );
};

const style = css`
  border: 1px solid red;
`;

export default Cropper;
