import fs from 'fs/promises';
import path from 'path';

import { Logger } from '@ricdotnet/logger/dist/index.js';

import config from '~~/config';
import { isValidAuthentication } from '~~/server/utils/auth';
import type { IFile } from '~~/types';

import { findFilesByUserId, findThumbnailByMediaId } from '../utils/db';

export default defineEventHandler(async (event) => {
  const { tokenData, error } = await isValidAuthentication(event);

  if (error) {
    Logger.get().error(`Error occurred: ${error}`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const files: IFile[] = [];
  const fileRows = await findFilesByUserId(tokenData!.id) as any[];

  for (const file of fileRows) {
    const filePath = path.join(config.UPLOADS_PATH(), file.original_filename);
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
