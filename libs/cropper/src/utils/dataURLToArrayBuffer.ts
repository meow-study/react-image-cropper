const REGEXP_DATA_URL_HEAD = /^data:.*,/;

export const dataURLToArrayBuffer = (dataURL: string) => {
  const base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, "");
  const binary = atob(base64);
  const arrayBuffer = new ArrayBuffer(binary.length);
  const uint8 = new Uint8Array(arrayBuffer);

  uint8.forEach((value, i) => {
    uint8[i] = binary.charCodeAt(i);
  });

  return arrayBuffer;
};
