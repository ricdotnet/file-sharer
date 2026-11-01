import fs from 'fs/promises';
import path from 'path';

import { Logger } from '@ricdotnet/logger/dist/index.js';

import config from '~~/config';
import { isValidAuthentication } from '~~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const { tokenData, error } = await isValidAuthentication(event);

  if (error || !tokenData?.id) {
    Logger.get().error(`Error occurred: ${error}`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const ids = await readBody<string[]>(event);
  await Promise.all(ids.map((id) => processDelete(tokenData.id, +id)));

  return 'Accepted';
});

async function processDelete(userId: number, id: number) {
  const [file] = (await deleteFileById(userId, id)) as any[];
  const filePath = path.join(config.UPLOADS_PATH(), file.filename);
  await fs.rm(filePath);

  if (file.is_video) {
    const thumbnailPath = path.join(
      config.UPLOADS_PATH(),
      'thumbnails',
      `${file.uuid}-thumbnail.png`,
    );
    await fs.rm(thumbnailPath);
  }
}
