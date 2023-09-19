import fs from 'fs/promises';
import path from 'path';
import {File} from '~/types';

export default defineEventHandler(async (event) => {
  const UPLOADS_PATH = path.join(process.cwd(), 'server', 'uploads');
  const uploadsDir = await fs.readdir(UPLOADS_PATH);
  const files: File[] = [];

  for (let file of uploadsDir) {
    if (file === '.gitkeep') continue;
    const filePath = path.join(UPLOADS_PATH, file);
    const fileInfo = await fs.stat(filePath);

    files.push({
      filename: file,
      size: fileInfo.size,
      created: fileInfo.birthtime,
    });
  }

  return {
    files,
  };
});
