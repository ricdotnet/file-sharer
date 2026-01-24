import fs from 'fs/promises';
import path from 'path';
import type { IFile } from '~~/types';
import config from '~~/config';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import { findFilesByUserId, findThumbnailByMediaId } from '../utils/db';
import { isValidAuthentication } from '~~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const files: IFile[] = [];

  const { tokenData, error } = await isValidAuthentication(event);

  if (error) {
    Logger.get().error(`Error occurred: ${error}`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const _files = await findFilesByUserId(tokenData!.id);

  // @ts-ignore
  for (let file of _files) {
    const filePath = path.join(config.UPLOADS_PATH(), file.filename);
    let fileInfo;

    try {
      fileInfo = await fs.stat(filePath);
    } catch (error) {
      Logger.get().error(`Error occurred: ${error} for file ${filePath}`);
      continue;
    }

    if (file.is_video) {
      const [thumbnail] = await findThumbnailByMediaId(file.id) as any[];

      if (thumbnail) {
        file.thumbnail = thumbnail.name;
      }
    }

    files.push({
      ...file,
      size: fileInfo.size,
      created: fileInfo.birthtime,
      canDelete: true, // TODO: update this later
    });
  }

  files.sort((a, b) => b.created.getTime() - a.created.getTime());

  return {
    files,
  };
});
