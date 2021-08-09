const REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;

export const isJpegURL = (url: any) => REGEXP_DATA_URL_JPEG.test(url);
