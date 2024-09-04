import mysql, { ConnectionOptions } from 'mysql2/promise';

const env = process.env;

const access: ConnectionOptions = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  host: env.DB_HOST,
};

const db = mysql.createConnection(access);

export { db };
