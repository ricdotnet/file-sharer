import type { H3Event } from 'h3';
import fsp from 'node:fs/promises';
import path from 'path';
import config from '~~/config';

export default defineEventHandler(async (event: H3Event) => {
  const name = getRouterParam(event, 'name');

  if (!name) {
    return;
  }

  const thumbnail = await fsp.readFile(path.join(config.UPLOADS_PATH(), 'thumbnails', name));

  setResponseHeaders(event, {
    'Content-Length': thumbnail.length,
    'Content-Type': 'image/png',
    'Access-Control-Allow-Origin': '*',
  });

  return thumbnail;
});
