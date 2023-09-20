import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event); // TODO: Error handling

  if (multipart && multipart.length > 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot upload more than one file at a time',
    })
  }

  if (multipart) {
    const file = multipart[0];

    if (file.data.length > 10_000_000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot upload files larger than 10MB',
      });
    }

    await fs.writeFile(path.join(process.cwd(), 'server', 'uploads', file.filename ?? 'unknown'), file.data);
  }

  return sendRedirect(event, '/');
});