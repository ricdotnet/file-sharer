import { generateToken, isValidAuthentication } from '~~/server/utils/auth';
import config from '~~/config';

export default defineEventHandler(async (event) => {
  const { tokenData, error } = await isValidAuthentication(event);

  if (error) {
    config.logger.error(`Error occurred: ${error}`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  if (!tokenData) {
    config.logger.error('Token data is missing');
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const apiToken = generateToken(
    { username: tokenData.username, id: tokenData.id, email: tokenData.email },
    'api',
  );

  return {
    apiToken,
  };
});
