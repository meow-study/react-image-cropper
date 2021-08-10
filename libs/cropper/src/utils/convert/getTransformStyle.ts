/**
 * calculate 「transform」 CSSProperties when 「transformOrigin」 is "0 0"
 */
export const getTransformStyle = ({
  width,
  height,
  rotate = 0,
  scaleX = 1,
  scaleY = 1,
  crop,
}: {
  width: number;
  height: number;
  rotate?: 0 | 90 | -90 | 180;
  scaleX?: 1 | -1;
  scaleY?: 1 | -1;
  crop?: {
    top: number;
    left: number;
  };
}) => {
  let translateX = 0;
  let translateY = 0;

  let index = 3;
  if (scaleX === -1 && scaleY === +1) index = 0;
  if (scaleX === +1 && scaleY === -1) index = 1;
  if (scaleX === -1 && scaleY === -1) index = 2;
  if (scaleX === +1 && scaleY === +1) index = 3;
  // const index = scaleX === -1 && scaleY === +1 ? 0 : scaleX === +1 && scaleY === -1 ? 1 : scaleX === -1 && scaleY === -1 ? 2 : 3;

  if (crop) {
    const { top, left } = crop;
    const cropList = {
      "0": [
        [-width + left, 0 - top],
        [0 - left, -height + top],
        [-width + left, -height + top],
        [0 - left, 0 - top],
      ],
      "90": [
        [-height + top, -width + left],
        [0 - top, 0 - left],
        [-height + top, 0 - left],
        [0 - top, -width + left],
      ],
      "180": [
        [0 - left, -height + top],
        [-width + left, 0 - top],
        [0 - left, 0 - top],
        [-width + left, -height + top],
      ],
      "-90": [
        [0 - top, 0 - left],
        [-height + top, -width + left],
        [0 - top, -width + left],
        [-height + top, 0 - left],
      ],
    };

    [translateX, translateY] = cropList[String(rotate) as "0" | "90" | "-90" | "180"][index];
    return `rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY}) translate(${translateX}px, ${translateY}px)`;
  }

  const list = {
    "0": [
      [-width, 0],
      [0, -height],
      [-width, -height],
      [0, 0],
    ],
    "90": [
      [-height, -width],
      [0, 0],
      [-height, 0],
      [0, -width],
    ],
    "180": [
      [0, -height],
      [-width, 0],
      [0, 0],
      [-width, -height],
    ],
    "-90": [
      [0, 0],
      [-height, -width],
      [0, -width],
      [-height, 0],
    ],
  };

  [translateX, translateY] = list[String(rotate) as "0" | "90" | "-90" | "180"][index];
  return `rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY}) translate(${translateX}px, ${translateY}px)`;
};
