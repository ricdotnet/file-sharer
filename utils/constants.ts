export const MAX_FILE_SIZE = 100_000_000; // 100 MB
export const MAX_VIDEO_SIZE = 500_000_000; // 500 MB
export const COOKIE_NAME = 'file-sharer';
export const AUTH_TOKEN_EXPIRE = '60m';
export const REFRESH_TOKEN_EXPIRE = '24h';
export const COOKIE_EXPIRE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);