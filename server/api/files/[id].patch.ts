import type { H3Event } from 'h3';

import { isValidAuthentication } from '~~/server/utils/auth';
import { updateFileById } from '~~/server/utils/db';
import config from '~~/config';

export default defineEventHandler(async (event: H3Event) => {
  const { tokenData, error } = await isValidAuthentication(event);

  if (error) {
    config.logger.error(`Error occurred: ${error}`);
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
