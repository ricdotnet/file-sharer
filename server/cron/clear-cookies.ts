import { defineCronHandler } from '#nuxt/cron';
import { clearExpiredCookies } from '~~/server/utils/db';
import config from '~~/config';

export default defineCronHandler('hourly', async () => {
  config.logger.info('Will clear expired cookies.');
  await clearExpiredCookies();
  config.logger.info('Cleared expired cookies.');
});
