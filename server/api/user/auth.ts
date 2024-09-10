import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
  const token = event.headers.get('Authorization');

  if (!token) {
    return createError({ statusCode: 401 });
  }

  try {
    jwt.verify(token, process.env.SECRET as string);
  } catch (err) {
    return createError({ statusCode: 401 });
  }

  return { isAuthenticated: true };
});
