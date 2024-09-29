import { Logger } from '@ricdotnet/logger/dist/index.js';

const logLevel = process.env.NODE_ENV === 'development'
  ? 'debug'
  : 'info';

// @ts-ignore
new Logger({ logToFile: true, level: logLevel });

export default {
  UPLOADS_PATH: () => {
    if (process.env.NODE_ENV === 'development') return 'server/uploads';

    return '/file-sharer/uploads';
  },
  IGNORED_FILES: ['.gitkeep'],
};
