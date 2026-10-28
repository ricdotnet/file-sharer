import { Logger } from '@ricdotnet/logger/dist/index.js';
import { LogLevels } from '@ricdotnet/logger/dist/src/Constants.js';

const logLevel =
  process.env.NODE_ENV === 'development' ? LogLevels.DEBUG : LogLevels.INFO;

new Logger({ logToFile: true, level: logLevel });

export default {
  UPLOADS_PATH: () => {
    if (process.env.NODE_ENV === 'development') {
      return 'server/uploads';
    }

    return '/file-sharer/uploads';
  },
  IGNORED_FILES: ['.gitkeep'],
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE ?? 1024 * 1024 * 150, // 150MB
  MAX_VIDEO_SIZE: process.env.MAX_VIDEO_SIZE ?? 1024 * 1024 * 1024, // 1GB
};
