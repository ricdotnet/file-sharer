import fs from 'fs/promises';
import path from 'path';
import config from '~/config';
import { Logger } from '@ricdotnet/logger/dist/index.js';

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event); // TODO: Error handling

  if (!multipart) {
    Logger.get().error('Tried to post an empty form');
    return sendRedirect(event, '/error', 400);
  }

  // TODO: handle this better
  if (multipart.length > 2) {
    Logger.get().error('Tried to upload multiple files');
    return sendRedirect(event, '/error', 400);
  }

  if (multipart[1].name !== 'auth-key') {
    Logger.get().error('Auth key not set');
    return sendRedirect(event, '/error', 400);
  }

  const authKey = multipart[1].data.toString();

  if (authKey !== process.env.SECRET) {
    Logger.get().error('Invalid auth key');
    return sendRedirect(event, '/error', 400);
  }

  const file = multipart[0];

  if (file.data.length > 10_000_000) {
    Logger.get().error('Tried to upload a file larger than 10MB');
    return sendRedirect(event, '/error', 400);
  }

  await fs.writeFile(path.join(config.UPLOADS_PATH(), file.filename ?? 'unknown'), file.data);

  return sendRedirect(event, '/');
});