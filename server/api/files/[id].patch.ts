import { H3Event } from 'h3';
import { updateFileById } from '~/server/utils/db';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import { isValidAuthentication } from '~/server/utils/auth';

export default defineEventHandler(async (event: H3Event) => {
  const { tokenData, error } = await isValidAuthentication(event);

  if (error) {
    Logger.get()
          .error(`Error occurred: ${error}`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!id) {
    return;
  }

  await updateFileById(tokenData!.id, +id, body.is_private);

  setResponseStatus(event, 204);

  return 'Accepted';
});
