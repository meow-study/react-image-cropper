export const removeEmpty = (obj: any) => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
};
