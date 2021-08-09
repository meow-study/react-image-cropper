import type { FC } from "react";
import { memo, useMemo } from "react";
import { tw } from "twind";

// * --------------------------------------------------------------------------- comp

/**
 * used to enhance crop func
 */
export const Canvas: FC = memo(() => {
  return useMemo(() => {
    return <div className={tw`absolute`} />;
  }, []);
});
