import { H3Event } from 'h3';
import { updateFileById } from '~/server/utils/db';

export default defineEventHandler(async (event: H3Event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!id) return;

  await updateFileById(+id, body.is_private);

  setResponseStatus(event, 204);

  return 'Accepted';
});
