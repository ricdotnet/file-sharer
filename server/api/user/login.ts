import { findUserByUsername } from '~~/server/utils/db';
import type { IUser, TUserAuthenticated, TUserAuthenticatedTokenPayload, TUserResult } from '~~/server/utils/types';
import { Messages } from '~~/server/utils/messages';
import * as argon from 'argon2';
import { generateCookie, generateToken } from '~~/server/utils/auth';

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return createError({
      statusCode: 404,
    });
  }

  const { username, password } = await readBody<IUser>(event);

  if (!username || !password) {
    return createError({ statusCode: 400, message: Messages.INVALID_PAYLOAD });
  }

  let rows;

  try {
    rows = await findUserByUsername(username);
    if (!Array.isArray(rows) || !rows.length) {
      return createError({ statusCode: 400, message: Messages.USER_NOT_FOUND });
    }
  } catch (err) {
    console.log(err);
    return createError({ statusCode: 500, message: Messages.FAILED_TO_FIND_USER_BY_USERNAME });
  }

  const user = rows[0] as TUserResult;
  if (!(await argon.verify(user.password, password))) {
    return createError({ statusCode: 401, message: Messages.INVALID_PASSWORD });
  }

  setResponseStatus(event, 200);

  const userAuthenticatedTokenPayload: TUserAuthenticatedTokenPayload = {
    username: user.username,
    email: user.email,
    id: user.id,
  };

  const token = generateToken(userAuthenticatedTokenPayload);

  const userAuthenticated: TUserAuthenticated = {
    ...userAuthenticatedTokenPayload,
    token,
  };

  await generateCookie(event, user.id);

  return userAuthenticated;
});
