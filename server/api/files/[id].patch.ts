import { H3Event } from 'h3';
import { updateFileById } from '~/server/utils/db';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event: H3Event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!id) return;

  const token = event.headers.get('Authorization');

  if (!token) {
    Logger.get().error('Tried to update a file without a token');
    return sendRedirect(event, '/error', 400);
  }

  let decoded: TUserAuthenticatedTokenPayload;
  try {
    decoded = jwt.verify(token, process.env.SECRET as string) as TUserAuthenticatedTokenPayload;
  } catch (err: any) {
    Logger.get().error(`Tried to update a file with an invalid token: ${err.message}`);
    return sendRedirect(event, '/error', 400);
  }

  await updateFileById(decoded.id, +id, body.is_private);

  setResponseStatus(event, 204);

  return 'Accepted';
});
