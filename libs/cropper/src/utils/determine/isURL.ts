const REGEXP_DATA_URL = /^data:/;

export const isURL = (url: any) => REGEXP_DATA_URL.test(url);
