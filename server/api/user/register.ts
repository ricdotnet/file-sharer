import { findUserByUsername, findUserByEmail, createUser } from '~~/server/utils/db';
import type { IUser } from '~~/server/utils/types';
import { Messages } from '~~/server/utils/messages';

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return createError({
      statusCode: 404,
    });
  }

  const { username, email, password } = await readBody<IUser>(event);

  if (!username || !email || !password) {
    return createError({ statusCode: 400, message: Messages.INVALID_PAYLOAD });
  }

  if (password.length <= 8) {
    return createError({ statusCode: 400, message: Messages.INVALID_PASSWORD_LENGTH });
  }

  let rows;

  try {
    rows = await findUserByUsername(username);
    if (Array.isArray(rows) && rows.length) {
      return createError({ statusCode: 400, message: Messages.USERNAME_EXISTS });
    }
  } catch (err) {
    console.log(err);
    return createError({ statusCode: 500, message: Messages.FAILED_TO_FIND_USER_BY_USERNAME });
  }

  try {
    rows = await findUserByEmail(email);
    if (Array.isArray(rows) && rows.length) {
      return createError({ statusCode: 400, message: Messages.EMAIL_EXISTS });
    }
  } catch (err) {
    console.log(err);
    return createError({ statusCode: 500, message: Messages.FAILED_TO_FIND_USER_BY_EMAIL });
  }

  try {
    await createUser(username, password, email);
  } catch (err) {
    console.log(err);
    return createError({ statusCode: 500, message: Messages.FAILED_TO_CREATE_USER });
  }

  setResponseStatus(event, 201);

  return 'Created';
});
