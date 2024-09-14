import path from 'path';
import fs from 'fs/promises';
import { H3Event } from 'h3';
import { deleteFileById } from '~/server/utils/db';
import config from '~/config';

export default defineEventHandler(async (event: H3Event) => {
  const id = getRouterParam(event, 'id');

  if (!id) return;

  // @ts-ignore
  const [file] = await deleteFileById(+id);
  const filePath = path.join(config.UPLOADS_PATH(), file.filename);
  await fs.rm(filePath);

  setResponseStatus(event, 204);

  return 'Accepted';
});
