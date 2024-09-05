import jwt from 'jsonwebtoken';
import { findUserByUsername } from '~/server/utils/db';
import { IUser, TUserAuthenticated, TUserAuthenticatedTokenPayload, TUserResult } from '~/server/utils/types';

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return createError({
      statusCode: 404,
      statusMessage: 'Route not found',
    });
  }

  const { username, password } = await readBody<IUser>(event);

  if (!username || !password) {
    return createError({ statusCode: 400, message: 'Invalid payload' });
  }

  const [rows] = await findUserByUsername(username);
  if (!Array.isArray(rows) || !rows.length) {
    return createError({ statusCode: 400, message: 'User not found' });
  }

  const user = rows[0] as TUserResult;
  if (user.password !== password) {
    return createError({ statusCode: 401, message: 'Invalid password' });
  }

  setResponseStatus(event, 200);

  const userAuthenticatedTokenPayload: TUserAuthenticatedTokenPayload = {
    username: user.username,
    email: user.email,
    id: user.id,
  };

  let token;
  try {
    token = jwt.sign(userAuthenticatedTokenPayload, process.env.SECRET as string, { expiresIn: '1h' });
  } catch (err) {
    return createError({ statusCode: 500, message: 'Failed to sign token' });
  }

  const userAuthenticated: TUserAuthenticated = {
    ...userAuthenticatedTokenPayload,
    token,
  }

  return userAuthenticated;
});
