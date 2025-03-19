import { findCookie, findUserById, getCookie } from '#imports';
import { COOKIE_NAME } from '~/utils/constants';
import { TUserAuthenticatedTokenPayload, TUserResult } from '~/server/utils/types';
import { generateCookie, generateToken } from '~/server/utils/auth';
import { Logger } from '@ricdotnet/logger/dist';

export default defineEventHandler(async (event) => {
  const isRefresh = true;
  const cookie = getCookie(event, COOKIE_NAME);

  if (!cookie) {
    return createError({ statusCode: 401, message: 'Cookie is not available' });
  }

  const cookieRows = await findCookie(cookie) as ICookie[];
  const cookieData = cookieRows[0];

  if (new Date(cookieData.expires) > new Date()) {
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
