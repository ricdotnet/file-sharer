import fs from 'fs/promises';
import path from 'path';

import { Logger } from '@ricdotnet/logger/dist/index.js';
import type { H3Event } from 'h3';

import config from '~~/config';
import { isValidAuthentication } from '~~/server/utils/auth';
import { deleteFileById } from '~~/server/utils/db';

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
    const thumbnailPath = path.join(config.UPLOADS_PATH(), 'thumbnails', `${file.uuid}-thumbnail.png`);
    await fs.rm(thumbnailPath);
  }

  setResponseStatus(event, 204);

  return 'Accepted';
});
