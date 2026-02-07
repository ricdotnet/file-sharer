import { Logger } from '@ricdotnet/logger/dist/index.js';

import { generateToken, isValidAuthentication } from '~~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const { tokenData, error } = await isValidAuthentication(event);

  if (error) {
    Logger.get().error(`Error occurred: ${error}`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  if (!tokenData) {
    Logger.get().error('Token data is missing');
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const apiToken = generateToken({ username: tokenData.username, id: tokenData.id, email: tokenData.email }, 'api');

  return {
    apiToken,
  };
});
