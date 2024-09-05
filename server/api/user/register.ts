import { db, findUserByUsername, findUserByEmail } from '~/server/utils/db';
import { IUser } from '~/server/utils/types';

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return createError({
      statusCode: 404,
      statusMessage: 'Route not found',
    });
  }

  const { username, email, password } = await readBody<IUser>(event);

  if (!username || !email || !password) {
    return createError({ statusCode: 400, message: 'Invalid payload' });
  }

  if (password.length <= 8) {
    return createError({ statusCode: 400, message: 'Password must be longer than 8 characters' });
  }

  let rows;
  [rows] = await findUserByUsername(username);
  if (Array.isArray(rows) && rows.length) {
    return createError({ statusCode: 400, message: 'Username already registered' });
  }

  [rows] = await findUserByEmail(email);
  if (Array.isArray(rows) && rows.length) {
    return createError({ statusCode: 400, message: 'Email already registered' });
  }

  const preparedStatement = await db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)');
  await preparedStatement.execute([username, password, email]);

  setResponseStatus(event, 201);

  return 'Created';
});
