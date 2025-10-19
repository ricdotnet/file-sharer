import crypto from 'node:crypto';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import { createFile, createThumbnail } from '../utils/db';
import { MAX_FILE_SIZE, MAX_VIDEO_SIZE } from '~/utils/constants';
import { isValidAuthentication } from '~/server/utils/auth';
import formidable from 'formidable';
import config from '~/config';
import { exec } from 'node:child_process';
import { ensureDir } from '~/server/utils/io';

export default defineEventHandler(async (event) => {
  const { tokenData, error } = await isValidAuthentication(event);
  const uuid = crypto.randomUUID();

  if (error) {
    Logger.get().error(`Error occurred: ${error}`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const randomBytes = crypto.randomBytes(8).toString('hex');

  const multipart = formidable({
    maxFileSize: MAX_VIDEO_SIZE,
    uploadDir: config.UPLOADS_PATH(),
    filename: (_, __, { originalFilename }) => {
      const extension = originalFilename?.split('.').pop();

      return `${uuid}.${extension}`;
    },
  });
  const [fields, { file }] = await multipart.parse(event.node.req);

  if (!file || !file.length) {
    Logger.get().error('No files uploaded');
    return sendRedirect(event, '/error', 400);
  }

  // TODO: refactor and correct if wrong
  if (file.length > 1) {
    // const hasTypeCount = multipart.filter((item) => 'type' in item);

    // if (hasTypeCount.length > 1) {
    Logger.get().error('Tried to upload multiple files');
    return sendRedirect(event, '/error', 400);
    // }
  }

  const token = event.headers.get('Authorization');

  if (!token) {
    Logger.get().error('Tried to upload a file without a token');
    return sendRedirect(event, '/error', 400);
  }

  // If isPrivate is not set then it will be true by default, if it is set, we check for its bool value
  const isPrivate = fields.is_private ? fields.is_private[0] === 'true' : false;

  const isImage = file[0].mimetype?.startsWith('image/') ?? false;
  const isVideo = file[0].mimetype?.startsWith('video/') ?? false;

  if (isVideo && file[0].size > MAX_VIDEO_SIZE) {
    Logger.get().error('Tried to upload a video larger than the allowed size');
    return sendRedirect(event, '/error', 400);
  }

  if (!isVideo && file[0].size > MAX_FILE_SIZE) {
    Logger.get().error('Tried to upload a file larger than the allowed size');
    return sendRedirect(event, '/error', 400);
  }

  // TODO: add mimetype to db
  const fileName = file[0].newFilename;
  await createFile(tokenData!.id, file[0].originalFilename ?? 'NO_NAME', fileName, uuid, {
    is_private: !isVideo && !isImage,
    is_image: isImage,
    is_video: isVideo,
  });

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
    return { fileName, share: `${process.env.NUXT_APP_URL}/view/${uuid}` };
  }

  return sendRedirect(event, '/');
});
