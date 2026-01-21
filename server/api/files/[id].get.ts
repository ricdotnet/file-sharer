import { H3Event } from 'h3';
import { findFileByUuid, findThumbnailByMediaId } from '~/server/utils/db';
import { hasFileAccess } from '~/server/utils/auth';

export default defineEventHandler(async (event: H3Event) => {
  const fileName = getRouterParam(event, 'id');

  if (!fileName) {
    return;
  }

  const [file] = await findFileByUuid(decodeURI(fileName)) as any[];
  const isFileOwner = await hasFileAccess(event, file.owner);

  if (file.is_private && !isFileOwner) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  if (file.is_video) {
    const [thumbnail] = await findThumbnailByMediaId(file.id) as any[];

    if (thumbnail) {
      file.thumbnail = thumbnail.name;
    }
  }

  return { ...file, canDelete: isFileOwner };
});
