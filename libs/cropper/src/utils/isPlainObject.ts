import { isObject } from "./isObject";

export const isPlainObject = (value: any) => {
  if (!isObject(value)) {
    return false;
  }

  try {
    const { constructor } = value;
    const { prototype } = constructor;
    const { hasOwnProperty } = Object.prototype;

    return constructor && prototype && hasOwnProperty.call(prototype, "isPrototypeOf");
  } catch (error) {
    return false;
  }
};
