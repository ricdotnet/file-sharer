import { H3Event } from 'h3';
import { findFileByFilename } from '~/server/utils/db';

export default defineEventHandler(async (event: H3Event) => {
  const fileName = getRouterParam(event, 'fileName');

  if (!fileName) {
    return;
  }

  const [file] = await findFileByFilename(decodeURI(fileName)) as any[];

  return { ...file };
});
