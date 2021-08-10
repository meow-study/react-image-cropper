import type { FC } from "react";
import { css, cx } from "@emotion/css";
import { tw } from "twind";
import { rafBatch, store, useValue } from "../utils";
import { getCropProps, getCropStore } from "@react-image-cropper/cropper";
import { useEffect, useMemo, useRef } from "react";

const WRAPPER_PADDING = 30;

// * --------------------------------------------------------------------------- store

interface ContainerSizeType {
  width: number;
  height: number;
}
export const containerSizeStore = store<ContainerSizeType>({ width: 0, height: 0 });
export const getContainerSize = () => containerSizeStore.get();

// * --------------------------------------------------------------------------- serv

const useContainer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      rafBatch(() => {
        const { offsetWidth, offsetHeight } = container;
        containerSizeStore.set({ width: offsetWidth, height: offsetHeight });
      }).then();
    }
  }, [containerRef]);

  // * --------------------------- adjust scroll when img loaded

  const { ready, naturalHeight, naturalWidth } = useValue(getCropStore);

  // TODO: 根据图片加载后的 wrapper 的 size 进行计算// XuYuCheng 2021/08/9

  useEffect(() => {
    const container = containerRef.current;
    if (ready && container) {
      const { offsetWidth, offsetHeight } = container;
      container.scrollLeft = (naturalWidth + 60 - offsetWidth) / 2;
      container.scrollTop = (naturalHeight + 60 - offsetHeight) / 2;
    }
  }, [containerRef, naturalHeight, naturalWidth, ready]);

  // * --------------------------- wrapper size

  const WRAPPER_PADDING = 30;
  const wrapperStyle = useMemo(() => {
    return {
      width: naturalWidth + WRAPPER_PADDING * 2,
      height: naturalHeight + WRAPPER_PADDING * 2,
    };
  }, [naturalHeight, naturalWidth]);

  return { containerRef, wrapperStyle };
};

// * --------------------------------------------------------------------------- comp

/**
 * three layers totally
 *
 *  1. control scroll
 *  2. padding support
 *  3. canvas: children.left = 0
 *
 */
export const Container: FC = ({ children }) => {
  const { background } = useValue(getCropProps);
  const { containerRef, wrapperStyle } = useContainer();

  return useMemo(() => {
    return (
      <div
        ref={containerRef}
        className={cx("cropper-container", tw`w-full h-full overflow-auto relative`, background && container)}
      >
        {/* 居中还是固定 padding-top，待讨论 */}
        <div className={cx("cropper-wrapper", tw`m-auto`, wrapper)} style={wrapperStyle}>
          <div className={tw`relative w-full h-full select-none`}>{children}</div>
        </div>
      </div>
    );
  }, [background, children, containerRef, wrapperStyle]);
};

// * --------------------------------------------------------------------------- style

const container = css`
  background-color: #ddd;
`;

const wrapper = css`
  width: 1320px;
  height: 720px;
  padding: ${WRAPPER_PADDING}px;
`;
