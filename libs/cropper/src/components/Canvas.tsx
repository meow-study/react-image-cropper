import type { FC } from "react";
import { memo, useMemo } from "react";
import { tw } from "twind";

// * --------------------------------------------------------------------------- comp

export const Canvas: FC = memo(() => {
  return useMemo(() => {
    return <div className={tw`absolute`}>123123</div>;
  }, []);
});
