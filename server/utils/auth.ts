import { TUserAuthenticatedTokenPayload } from './types';
import jwt from 'jsonwebtoken';
import { AUTH_TOKEN_EXPIRE, COOKIE_EXPIRE, COOKIE_NAME, REFRESH_TOKEN_EXPIRE } from '~/utils/constants';
import crypto from 'crypto';
import type { H3Event } from 'h3';
import { saveCookie, updateCookie } from '~/server/utils/db';
import { Logger } from '@ricdotnet/logger/dist';

export function generateToken(payload: TUserAuthenticatedTokenPayload | {}, type: 'auth' | 'refresh' = 'auth'): string {
  const secret = process.env.SECRET;

  if (!secret) {
    throw new Error('Missing secret');
  }

  return jwt.sign(payload, secret, { expiresIn: type === 'auth' ? AUTH_TOKEN_EXPIRE : REFRESH_TOKEN_EXPIRE });
}

export async function generateCookie(event: H3Event, userId: number, isRefresh = false) {
  const cookie = crypto.randomBytes(16)
                       .toString('hex');

  setCookie(event, COOKIE_NAME, cookie, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: COOKIE_EXPIRE,
  });

  const refreshToken = generateToken({}, 'refresh');

  if (isRefresh) {
    const oldCookie = getCookie(event, COOKIE_NAME);

    if (!oldCookie) {
      throw new Error('Missing cookie');
    }

    await updateCookie(oldCookie, cookie, refreshToken);
  } else {
    await saveCookie(userId, cookie, refreshToken);
  }
}

export async function isValidAuthentication(event: H3Event) {
  const secret = process.env.SECRET;
  const authToken = getHeader(event, 'authorization');

  if (!secret) {
    Logger.get()
          .error('SECRET was not found in the environment');
    throw createError({ statusCode: 500, message: 'Something went wrong.' });
  }

  if (!authToken) {
    throw createError({ statusCode: 400 });
  }

  let tokenData;

  try {
    tokenData = jwt.verify(authToken, secret) as TUserAuthenticatedTokenPayload;
  } catch (err) {
    Logger.get()
          .error(`Error occurred: ${err}`);

    return { error: err };
  }

  return { tokenData };
}