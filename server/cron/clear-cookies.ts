import { Logger } from '@ricdotnet/logger/dist/index.js';

import { defineCronHandler } from '#nuxt/cron';
import { clearExpiredCookies } from '~~/server/utils/db';

export default defineCronHandler('hourly', async () => {
  Logger.get().info('Will clear expired cookies.');
  await clearExpiredCookies();
  Logger.get().info('Cleared expired cookies.');
});
