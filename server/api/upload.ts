import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import config from '~/config';
import jwt from 'jsonwebtoken';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import { createFile } from '../utils/db';

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event); // TODO: Error handling

  if (!multipart) {
    Logger.get().error('No files uploaded');
    return sendRedirect(event, '/error', 400);
  }

  if (multipart.length > 1) {
    const hasTypeCount = multipart.filter((item) => 'type' in item);

    if (hasTypeCount.length > 1) {
      Logger.get().error('Tried to upload multiple files');
      return sendRedirect(event, '/error', 400);
    }
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
  } catch (err: any) {
    Logger.get().error(`Tried to upload a file with an invalid token: ${err.message}`);
    return sendRedirect(event, '/error', 400);
  }

  const randomBytes = crypto.randomBytes(8).toString('hex');
  const fileName = `${randomBytes}-${file.filename ?? 'NO_NAME'}`;

  try {
    await fs.writeFile(path.join(config.UPLOADS_PATH(), fileName), file.data);
  // biome-ignore lint/suspicious/noExplicitAny: allow any
  } catch (err: any) {
    Logger.get().error(`Failed to write file: ${err.message}`);
    return sendRedirect(event, '/error', 500);
  }

  // If isPrivate is not set then it will be true by default, if it is set, we check for its bool value
  const _isPrivate = multipart[2]?.data.toString('utf-8');
  const isPrivate = _isPrivate ? _isPrivate === 'true' : true;

  const isImage = multipart[1]?.data.toString('utf-8') === 'true';

  await createFile(decoded.id, file.filename ?? 'NO_NAME', fileName, { is_private: isPrivate, is_image: isImage });

  if (isImage) {
    return fileName;
  }

  return sendRedirect(event, '/');
});
