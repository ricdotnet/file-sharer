import { COOKIE_NAME } from '~/utils/constants';
import type { ICookie, TUserAuthenticatedTokenPayload, TUserResult } from '~~/server/utils/types';
import { generateCookie, generateToken } from '~~/server/utils/auth';
import { Logger } from '@ricdotnet/logger/dist/index.js';
import { findCookie, findUserById } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  const isRefresh = true;
  const cookie = getCookie(event, COOKIE_NAME);

  if (!cookie) {
    return createError({ statusCode: 401, message: 'Cookie is not available' });
  }

  const cookieRows = await findCookie(cookie) as ICookie[];
  if (!cookieRows.length) {
    return createError({ statusCode: 401, message: 'Cookie is not valid' });
  }

  const cookieData = cookieRows[0];
  if (!cookieData) {
    return createError({ statusCode: 401, message: 'Cookie is not valid' });
  }

  if (new Date(cookieData.expires) < new Date()) {
    // cookie is expired
    Logger.get().warn(`User ${cookieData.owner} called /me with an expired cookie`);
    return createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const userRows = await findUserById(cookieData.owner) as TUserResult[];
  const user = userRows[0] as TUserResult;

  const userAuthenticatedTokenPayload: TUserAuthenticatedTokenPayload = {
    username: user.username,
    email: user.email,
    id: user.id,
  };

  const authToken = generateToken(userAuthenticatedTokenPayload);
  await generateCookie(event, user.id, isRefresh);

  return { isAuthenticated: true, authToken };
});
