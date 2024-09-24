import path from 'path';
import fs from 'fs/promises';
import { H3Event } from 'h3';
import { deleteFileById } from '~/server/utils/db';
import config from '~/config';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event: H3Event) => {
  const id = getRouterParam(event, 'id');

  if (!id) return;

  const token = event.headers.get('Authorization');

  if (!token) {
    Logger.get().error('Tried to delete a file without a token');
    return sendRedirect(event, '/error', 400);
  }

  let decoded: TUserAuthenticatedTokenPayload;
  try {
    decoded = jwt.verify(token, process.env.SECRET as string) as TUserAuthenticatedTokenPayload;
  } catch (err: any) {
    Logger.get().error(`Tried to delete a file with an invalid token: ${err.message}`);
    return sendRedirect(event, '/error', 400);
  }

  // @ts-ignore
  const [file] = await deleteFileById(decoded.id, +id);
  const filePath = path.join(config.UPLOADS_PATH(), file.filename);
  await fs.rm(filePath);

  setResponseStatus(event, 204);

  return 'Accepted';
});
