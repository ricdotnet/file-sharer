import path from 'path';
import fs from 'fs/promises';
import { H3Event } from 'h3';
import { deleteFileById } from '~/server/utils/db';
import config from '~/config';
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

  if (!id) {
    return;
  }

  const [file] = await deleteFileById(tokenData!.id, +id) as any[];
  const filePath = path.join(config.UPLOADS_PATH(), file.filename);
  await fs.rm(filePath);

  if (file.is_video) {
    const thumbnailPath = path.join(config.UPLOADS_PATH(), 'thumbnails', `${file.filename}-thumbnail.png`);
    await fs.rm(thumbnailPath);
  }

  setResponseStatus(event, 204);

  return 'Accepted';
});
