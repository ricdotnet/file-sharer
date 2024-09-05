import mysql, { ConnectionOptions } from 'mysql2/promise';

const env = process.env;

const access: ConnectionOptions = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  host: env.DB_HOST,
};

let db: mysql.Connection;

(async () => {
  db = await mysql.createConnection(access);
})();

async function findUserByUsername(username: string) {
  return (await db.prepare('SELECT * FROM users WHERE username = ?')).execute([username]);
}

async function findUserByEmail(email: string) {
  return (await db.prepare('SELECT * FROM users WHERE email = ?')).execute([email]);
}

export { db, findUserByUsername, findUserByEmail };
