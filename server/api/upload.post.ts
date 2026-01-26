import { exec } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';

import { Logger } from '@ricdotnet/logger/dist/index.js';

import { MAX_FILE_SIZE, MAX_VIDEO_SIZE } from '~/utils/constants';
import config from '~~/config';
import { isValidAuthentication } from '~~/server/utils/auth';
import { createFile, createThumbnail, findFileByUuid } from '~~/server/utils/db';
import { ensureDir } from '~~/server/utils/io';

export default defineEventHandler(async (event) => {
  const { tokenData, error } = await isValidAuthentication(event);
  const uuid = crypto.randomUUID();

  if (error) {
    Logger.get().error(`Error occurred: ${error}`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const files = await readMultipartFormData(event);

  if (!files || !files.length) {
    Logger.get().error('No files uploaded');
    return sendRedirect(event, '/error', 400);
  }

  const token = event.headers.get('Authorization');

  if (!token) {
    Logger.get().error('Tried to upload a file without a token');
    return sendRedirect(event, '/error', 400);
  }

  const file = files.find(f => f.name === 'file');
  if (!file || !file.data) {
    Logger.get().error('No file uploaded');
    return sendRedirect(event, '/error', 400);
  }

  const isImage = file.type?.startsWith('image/') || false;
  const isVideo = file.type?.startsWith('video/') || false;

  if (isVideo && file.data.length > MAX_VIDEO_SIZE) {
    Logger.get().error('Tried to upload a video larger than the allowed size');
    return sendRedirect(event, '/error', 400);
  }

  if (!isVideo && file.data.length > MAX_FILE_SIZE) {
    Logger.get().error('Tried to upload a file larger than the allowed size');
    return sendRedirect(event, '/error', 400);
  }

  // TODO: add mimetype to db
  const fileName = file.filename ?? 'NO_NAME';
  await createFile(tokenData!.id, fileName, uuid, uuid, {
    is_private: !isVideo && !isImage,
    is_image: isImage,
    is_video: isVideo,
  });

  // TODO: write to temp folder, create thumbnail and remove
  await fs.writeFile(`${config.UPLOADS_PATH()}/${fileName}`, file.data);

  // if is video generate thumbnail after writing the file
  if (isVideo) {
    await ensureDir('thumbnails');

    const thumbnailPath = `${config.UPLOADS_PATH()}/thumbnails/${uuid}-thumbnail.png`;
    const filepath = `${config.UPLOADS_PATH()}/${fileName}`;
    const command = `ffmpeg -i "${filepath}" -ss 00:00:01.000 -vframes 1 "${thumbnailPath}"`;

    await new Promise((resolve, reject) => {
      exec(command, (error) => {
        if (error) {
          Logger.get().error(`Error generating thumbnail: ${error}`);
          reject(error);
        } else {
          resolve(thumbnailPath);
        }
      });
    });

    const [videoMetadata] = (await findFileByUuid(uuid)) as any[];
    await createThumbnail(`${uuid}-thumbnail.png`, videoMetadata.id);
  }

  if (isImage || isVideo) {
    return { fileName, share: `${process.env.NUXT_BASE_URL}/view/${uuid}` };
  }

  return sendRedirect(event, '/');
});
