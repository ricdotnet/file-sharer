import fs from 'fs/promises';
import path from 'path';
import config from "~/config";
import { findCookie, findFileByFilename } from '~/server/utils/db';
import { Messages } from '#imports';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  let filename = getRouterParam(event, 'file');
  let file;
  let isImage = false;

  if (!filename) return;

  if (/^[0-9]{1,8}(.bin)$/g.test(filename)) {
    const length = filename.match(/\d+/g);
    if (!length) return;

    const arr = new ArrayBuffer(+length![0]);
    file = Buffer.from(arr);
  } else {
    filename = decodeURI(filename);

    const [fileResult] = await findFileByFilename(filename) as any[];
    if (!fileResult) return createError({ statusCode: 404, message: Messages.FILE_NOT_FOUND });

    if (fileResult.is_private) {
      const cookie = getCookie(event, 'file-sharer');
      if (!cookie) {
        Logger.get().warn(`User tried to access private file ${filename} without a cookie`);
        return createError({ statusCode: 404, message: Messages.FILE_NOT_FOUND });
      }

      const [cookieResult] = await findCookie(cookie) as any[];
      if (!cookieResult) {
        Logger.get().warn(`User tried to access private file ${filename} with an invalid cookie`);
        return createError({ statusCode: 404, message: Messages.FILE_NOT_FOUND });
      }

      if (cookieResult.owner !== fileResult.owner) {
        Logger.get().warn(`User ${cookieResult.owner} tried to access file ${filename} owned by ${fileResult.owner}`);
        return createError({ statusCode: 404, message: Messages.FILE_NOT_FOUND });
      }
    }

    isImage = fileResult.is_image;

    file = await fs.readFile(path.join(config.UPLOADS_PATH(), filename));
  }

  if (!file) {
    Logger.get().warn(`File not found in the file system: ${filename}`);
    return createError({ statusCode: 404, message: Messages.FILE_NOT_FOUND });
  }

  if (isImage) {
    setResponseHeaders(event, {
      'content-type': 'image',
      'content-length': file.length,
    });
  } else {
    setResponseHeaders(event, {
      'content-type': 'application/octet-stream',
      'content-length': file.length,
      'content-disposition': `attachment; filename="${filename}"`,
    });
  }

  return file;
});
