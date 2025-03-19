import fs from 'fs/promises';
import path from 'path';
import { IFile } from '~/types';
import config from '~/config';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import { findFilesByUserId } from '../utils/db';
import { isValidAuthentication } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const files: IFile[] = [];

  const { tokenData, error } = await isValidAuthentication(event);

  if (error) {
    Logger.get()
          .error(`Error occurred: ${error}`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const _files = await findFilesByUserId(tokenData!.id);

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
