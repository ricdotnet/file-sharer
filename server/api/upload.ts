import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import config from '~/config';
import jwt from 'jsonwebtoken';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import { createFile } from '../utils/db';

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event); // TODO: Error handling

  if (!multipart) {
    Logger.get().error('Tried to post an empty form');
    return sendRedirect(event, '/error', 400);
  }

  if (multipart.length > 2) {
    Logger.get().error('Tried to upload multiple files');
    return sendRedirect(event, '/error', 400);
  }

  const token = event.headers.get('Authorization');

  if (!token) {
    Logger.get().error('Tried to upload a file without a token');
    return sendRedirect(event, '/error', 400);
  }

  const file = multipart[0];

  if (file.data.length > 10_000_000) {
    Logger.get().error('Tried to upload a file larger than 10MB');
    return sendRedirect(event, '/error', 400);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET as string) as TUserAuthenticatedTokenPayload;
  } catch (err) {
    Logger.get().error('Tried to upload a file with an invalid token');
    return sendRedirect(event, '/error', 400);
  }

  const randomBytes = crypto.randomBytes(8).toString('hex');
  const fileName = `${randomBytes}-${file.filename ?? 'NO_NAME'}`;

  try {
    await fs.writeFile(path.join(config.UPLOADS_PATH(), fileName), file.data);
  } catch (err) {
    Logger.get().error('Failed to write file');
    return sendRedirect(event, '/error', 500);
  } finally {
    await createFile(decoded.id, file.filename ?? 'NO_NAME', fileName);
  }

  return sendRedirect(event, '/');
});
