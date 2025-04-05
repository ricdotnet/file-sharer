import crypto from 'node:crypto';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import { createFile } from '../utils/db';
import { MAX_FILE_SIZE, MAX_VIDEO_SIZE } from '~/utils/constants';
import { isValidAuthentication } from '~/server/utils/auth';
import formidable from 'formidable';
import config from '~/config';

export default defineEventHandler(async (event) => {
  const { tokenData, error } = await isValidAuthentication(event);

  if (error) {
    Logger.get()
          .error(`Error occurred: ${error}`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const randomBytes = crypto.randomBytes(8)
                            .toString('hex');

  const multipart = formidable({
    maxFileSize: MAX_VIDEO_SIZE,
    uploadDir: config.UPLOADS_PATH(),
    filename: (_, __, { originalFilename }) => `${randomBytes}-${originalFilename ?? 'NO_NAME'}`,
  });
  const [fields, { file }] = await multipart.parse(event.node.req);

  if (!file || !file.length) {
    Logger.get()
          .error('No files uploaded');
    return sendRedirect(event, '/error', 400);
  }

  // TODO: refactor and correct if wrong
  if (file.length > 1) {
    // const hasTypeCount = multipart.filter((item) => 'type' in item);

    // if (hasTypeCount.length > 1) {
    Logger.get()
          .error('Tried to upload multiple files');
    return sendRedirect(event, '/error', 400);
    // }
  }

  const token = event.headers.get('Authorization');

  if (!token) {
    Logger.get()
          .error('Tried to upload a file without a token');
    return sendRedirect(event, '/error', 400);
  }

  // If isPrivate is not set then it will be true by default, if it is set, we check for its bool value
  const isPrivate = (fields.is_private) ? fields.is_private[0] === 'true' : false;

  const isImage = file[0].mimetype?.startsWith('image/') ?? false;
  const isVideo = file[0].mimetype?.startsWith('video/') ?? false;

  if (isVideo && file[0].size > MAX_VIDEO_SIZE) {
    Logger.get()
          .error('Tried to upload a video larger than the allowed size');
    return sendRedirect(event, '/error', 400);
  }

  if (!isVideo && file[0].size > MAX_FILE_SIZE) {
    Logger.get()
          .error('Tried to upload a file larger than the allowed size');
    return sendRedirect(event, '/error', 400);
  }

  const fileName = `${randomBytes}-${file[0].originalFilename ?? 'NO_NAME'}`;
  await createFile(tokenData!.id, file[0].originalFilename ?? 'NO_NAME', fileName, {
    is_private: isPrivate,
    is_image: isImage,
    is_video: isVideo,
  });

  if (isImage) {
    return fileName;
  }

  return sendRedirect(event, '/');
});
