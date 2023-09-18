import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
  const dir = await fs.readdir(path.join(process.cwd(), 'server', 'uploads'));

  return {
    files: dir
  };
});
