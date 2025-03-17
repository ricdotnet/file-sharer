import { COOKIE_NAME } from '~/utils/constants';
import { deleteCookieByValue } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, COOKIE_NAME);

  if (!cookie) {
    throw createError({ statusCode: 401, message: 'Cookie is not available' });
  }

  deleteCookie(event, COOKIE_NAME);

  await deleteCookieByValue(cookie);

  await sendRedirect(event, '/');
});