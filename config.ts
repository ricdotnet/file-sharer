import { Logger, JsonFormatter, PrettyFormatter } from '@ricdotnet/logger';

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = new Logger({
  level: isDevelopment ? 'debug' : 'info',
  formatter: isDevelopment ? new PrettyFormatter() : new JsonFormatter(),
  redact: ['host'],
});

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
  logger,
};
