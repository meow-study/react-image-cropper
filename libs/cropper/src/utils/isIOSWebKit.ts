export const IS_BROWSER = typeof window !== "undefined" && typeof window.document !== "undefined";
export const WINDOW = IS_BROWSER ? window : undefined;

export const isIOSWebKit = WINDOW?.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(WINDOW.navigator.userAgent);
