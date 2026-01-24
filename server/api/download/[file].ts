import fs from 'node:fs/promises';
import fsl from 'node:fs';
import path from 'node:path';
import config from '~~/config';
import { findCookie, findFileByFilename } from '~~/server/utils/db';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import type { H3Event } from 'h3';
import { Messages } from '~~/server/utils/messages';
import type { ICookie } from '~~/server/utils/types';

// TODO: refactor later
export default defineEventHandler(async (event: H3Event) => {
  const { digest } = getQuery(event);
  let filename = getRouterParam(event, 'file');
  let file: Buffer;
  let isImage = false;
  let isVideo = false;
  let originalFilename;

  if (!filename) {
    return;
  }

  filename = decodeURI(filename);

  if (/^\d{1,10}(.bin)$/g.test(filename)) {
    const length = filename.match(/\d+/g);
    if (!length) {
      return;
    }

    const arr = new ArrayBuffer(+length[0]);
    file = Buffer.from(arr);
  } else {
    filename = decodeURI(filename);

    // biome-ignore lint/suspicious/noExplicitAny: allow any
    const [fileResult] = (await findFileByFilename(filename)) as any[];
    if (!fileResult) {
      return createError({ statusCode: 404, message: Messages.FILE_NOT_FOUND });
    }

    if (fileResult.is_private && fileResult.digest !== digest) {
      const cookie = getCookie(event, 'file-sharer');
      if (!cookie) {
        Logger.get().warn(
          `User tried to access private file ${filename} without a cookie`
        );
        return createError({
          statusCode: 404,
          message: Messages.FILE_NOT_FOUND,
        });
      }

      const [cookieResult] = (await findCookie(cookie)) as ICookie[];
      if (!cookieResult) {
        Logger.get().warn(
          `User tried to access private file ${filename} with an invalid cookie`
        );
        return createError({
          statusCode: 404,
          message: Messages.FILE_NOT_FOUND,
        });
      }

      if (cookieResult.owner !== fileResult.owner) {
        Logger.get().warn(
          `User ${cookieResult.owner} tried to access file ${filename} owned by ${fileResult.owner}`
        );
        return createError({
          statusCode: 404,
          message: Messages.FILE_NOT_FOUND,
        });
      }
    }

    isImage = fileResult.is_image;
    isVideo = fileResult.is_video;
    originalFilename = fileResult.original_filename;

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
  } else if (isVideo) {
    const fileStat = await fs.stat(path.join(config.UPLOADS_PATH(), filename));

    const fileSize = fileStat.size;
    const rangeHeader = getRequestHeader(event, 'range');

    if (!rangeHeader) {
      setResponseHeaders(event, {
        'content-length': fileSize,
        'content-type': 'video/other', // TODO: update with correct mimetype
        'accept-ranges': 'bytes',
      });

      return fsl.createReadStream(path.join(config.UPLOADS_PATH(), filename));
    }

    // Credit to CHATGIPITTY
    const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    if (!match) {
      throw createError({
        statusCode: 416,
        statusMessage: 'Invalid Range Header',
      });
    }

    const start = parseInt(match[1] as string, 10);
    const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    // Set headers for partial content
    setResponseStatus(event, 206);
    setResponseHeaders(event, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize.toString(),
      'Content-Type': 'video/other', // TODO: update with correct mimetype
    });

    return fsl.createReadStream(path.join(config.UPLOADS_PATH(), filename), {
      start,
      end,
    });
  } else {
    setResponseHeaders(event, {
      'content-type': 'application/octet-stream',
      'content-length': file.length,
      'content-disposition': `attachment; filename="${originalFilename ?? filename}"`,
    });
  }

  return file;
});
