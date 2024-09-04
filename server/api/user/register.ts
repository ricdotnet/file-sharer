import { db } from '../../utils/db';

interface IUser {
  username: string;
  password: string;
  email: string;
};

async function findUserByUsername(username: string) {
  return (await (await db).prepare('SELECT * FROM users WHERE username = ?')).execute([username]);
}

async function findUserByEmail(email: string) {
  return (await (await db).prepare('SELECT * FROM users WHERE email = ?')).execute([email]);
}

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return createError({
      statusCode: 404,
      statusMessage: 'Route not found',
    });
  }

  const { username, email, password } = await readBody<IUser>(event);
  
  if (!username || !email || !password) {
    return createError({ statusCode: 400, statusMessage: 'Invalid payload' });
  }
  
  if (password.length <= 8) {
    return createError({ statusCode: 400, statusMessage: 'Password must be longer than 8 characters'});
  }
  
  let rows;
  [rows] = await findUserByUsername(username);
  if (Array.isArray(rows) && rows.length) {
    return createError({ statusCode: 400, statusMessage: 'Username already registered' });
  }
  
  [rows] = await findUserByEmail(email);
  if (Array.isArray(rows) && rows.length) {
    return createError({ statusCode: 400, statusMessage: 'Email already registered' });
  }

  const preparedStatement = await (await db).prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)');
  await preparedStatement.execute([username, password, email]);
  
  setResponseStatus(event, 201);

  return 'Created';
});