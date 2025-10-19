import { IFile } from '~/types';
import { generateToken, isValidAuthentication } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const files: IFile[] = [];

  const { tokenData, error } = await isValidAuthentication(event);

  if (error) {
    Logger.get().error(`Error occurred: ${error}`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const apiToken = generateToken({ username: tokenData.username, id: tokenData.id, email: tokenData.email }, 'auth');

  return {
    apiToken,
  };
});
