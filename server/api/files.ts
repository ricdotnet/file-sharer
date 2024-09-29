import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import { File } from '~/types';
import config from "~/config";
import { Logger } from '@ricdotnet/logger/dist/index.js';
import { findFilesByUserId } from '../utils/db';

export default defineEventHandler(async (event) => {
  const files: File[] = [];

  const token = event.headers.get('Authorization');
  let decoded;
  try {
    decoded = jwt.verify(token!, process.env.SECRET as string) as TUserAuthenticatedTokenPayload;
  } catch (err) {
    Logger.get().error('Tried to list files with an invalid token');
    return createError({ statusCode: 401 });
  }

  const _files = await findFilesByUserId(decoded.id);

  // @ts-ignore
  for (let file of _files) {
    const filePath = path.join(config.UPLOADS_PATH(), file.filename);
    const fileInfo = await fs.stat(filePath);

    files.push({
      ...file,
      size: fileInfo.size,
      created: fileInfo.birthtime,
      canDelete: true, // TODO: update this later
    });

    files.sort((a, b) => b.created.getTime() - a.created.getTime());
  }

  return {
    files,
  };
});
