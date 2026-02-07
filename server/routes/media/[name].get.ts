import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import type { H3Event } from 'h3';

import config from '~~/config';
import { findFileByFilename } from '~~/server/utils/db';

export default defineEventHandler(async (event: H3Event) => {
  const name = getRouterParam(event, 'name');

  if (!name) {
    return;
  }

  const [fileMetadata] = await findFileByFilename(name) as any[];

  const fileStat = await fsp.stat(path.join(config.UPLOADS_PATH(), fileMetadata.filename));
  const fileSize = fileStat.size;
  const rangeHeader = getRequestHeader(event, 'range') ?? '';

  setResponseHeaders(event, {
    'Content-Length': fileSize,
  });

  // Credit to CHATGIPITTY
  const match = rangeHeader.match(/bytes=(\d+)-(\d*)/) as Array<string> | null;
  const options: { start?: number; end?: number; } = {};

  if (match) {
    const start = parseInt(match[1] as string, 10);
    const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    options.start = start;
    options.end = end;

    setResponseStatus(event, 206);
    setResponseHeaders(event, {
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Content-Length': chunkSize.toString(),
    });
  }

  setResponseHeaders(event, {
    'Content-Type': 'video/mp4',
    'Access-Control-Allow-Origin': '*',
  });

  return fs.createReadStream(path.join(config.UPLOADS_PATH(), fileMetadata.filename), options);
});
