import fs from 'fs/promises';
import path from 'path';
import config from '~/config';

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event); // TODO: Error handling

  if (!multipart) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You must upload something',
    });
  }

  // TODO: handle this better
  if (multipart.length > 2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot upload more than one file at a time',
    });
  }

  if (multipart[1].name !== 'auth-key') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Auth key not set',
    });
  }

  const authKey = multipart[1].data.toString();

  if (authKey !== process.env.SECRET) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid auth key',
    });
  }

  const file = multipart[0];

  if (file.data.length > 10_000_000) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot upload files larger than 10MB',
    });
  }

  await fs.writeFile(path.join(config.UPLOADS_PATH(), file.filename ?? 'unknown'), file.data);

  return sendRedirect(event, '/');
});