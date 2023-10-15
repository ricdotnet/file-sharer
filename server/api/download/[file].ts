import fs from 'fs/promises';
import path from 'path';
import config from "~/config";

export default defineEventHandler(async (event) => {
  let filename = getRouterParam(event, 'file');
  let file;

  if (!filename) return;

  if (/^[0-9]{1,8}(.bin)$/g.test(filename)) {
    const length = filename.match(/\d+/g);
    if (!length) return;

    const arr = new ArrayBuffer(+length![0]);
    file = Buffer.from(arr);
  } else {
    filename = decodeURI(filename);
    file = await fs.readFile(path.join(config.UPLOADS_PATH(), filename));
  }

  if (!file) return;

  setResponseHeaders(event, {
    'content-type': 'application/octet-stream',
    'content-length': file.length,
    'content-disposition': `attachment; filename="${filename}"`,
  });

  return file;
});