import fs from 'fs/promises';
import path from 'path';
import {File} from '~/types';
import config from "~/config";

export default defineEventHandler(async (event) => {
  const uploadsDir = await fs.readdir(config.UPLOADS_PATH());
  const files: File[] = [];
  
  const auhtKey = getHeader(event, 'authorisation');
  const isAuthed = auhtKey === process.env.SECRET;

  for (let file of uploadsDir) {
    if (config.IGNORED_FILES.includes(file)) continue;
    const filePath = path.join(config.UPLOADS_PATH(), file);
    const fileInfo = await fs.stat(filePath);

    files.push({
      filename: file,
      size: fileInfo.size,
      created: fileInfo.birthtime,
      canDelete: isAuthed,
    });
  }

  return {
    files,
  };
});
