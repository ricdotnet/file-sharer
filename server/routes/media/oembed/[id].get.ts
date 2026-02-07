import { hasFileAccess } from '~~/server/utils/auth';
import { findFileByUuid, findThumbnailByMediaId } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  const fileName = getRouterParam(event, 'id');

  if (!fileName) {
    return;
  }

  const [file] = (await findFileByUuid(decodeURI(fileName))) as any[];

  if (file.is_private && !(await hasFileAccess(event, file.owner))) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const [thumbnail] = (await findThumbnailByMediaId(file.id)) as any[];

  if (thumbnail) {
    file.thumbnail = thumbnail.name;
  }

  const baseUrl = process.env.NUXT_BASE_URL;

  return {
    version: '1.0',
    type: 'video', // or 'rich', 'photo', etc.
    provider_name: 'File-Sharer',
    provider_url: baseUrl,
    title: `Video ${fileName}`,
    author_name: 'Ricardo',
    author_url: 'https://ricr.dev',
    html: `<iframe src="${baseUrl}/media/${file.filename}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`,
    width: 640,
    height: 360,
    thumbnail_url: `${baseUrl}/media/t/${file.thumbnail}`,
    thumbnail_width: 640,
    thumbnail_height: 360,
  };
});
