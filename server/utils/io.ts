import fsp from 'fs/promises';
import path from 'path';

import config from '~~/config';

export const ensureDir = async (dir: string) => {
  try {
    await fsp.mkdir(path.join(config.UPLOADS_PATH(), dir), { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${path}:`, error);
  }
};
