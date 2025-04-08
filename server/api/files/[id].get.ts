import { H3Event } from 'h3';
import { findFileByUuid } from '~/server/utils/db';

export default defineEventHandler(async (event: H3Event) => {
  const fileName = getRouterParam(event, 'id');

  if (!fileName) {
    return;
  }

  const [file] = await findFileByUuid(decodeURI(fileName)) as any[];

  return { ...file };
});
