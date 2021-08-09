import { tw } from "twind";
import { css, cx } from "@emotion/css";

export const Cropper = () => {
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
