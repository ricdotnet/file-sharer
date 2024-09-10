import mysql, { PoolOptions } from 'mysql2/promise';

const env = process.env;

// 10 connections by default
const access: PoolOptions = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  host: env.DB_HOST,
  port: env.DB_PORT as unknown as number,
};

const db: mysql.Pool = mysql.createPool(access);

async function findUserByUsername(username: string) {
  let conn;
  let rows;

  try {
    conn = await db.getConnection();
    [rows] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
  } catch (err) {
    throw err;
  } finally {
    conn?.release();
  }
  return rows;
}

async function findUserByEmail(email: string) {
  let conn;
  let rows;

  try {
    conn = await db.getConnection();
    [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
  } catch (err) {
    throw err;
  } finally {
    conn?.release();
  }

  return rows;
}

async function createUser(username: string, password: string, email: string) {
  let conn;

  try {
    conn = await db.getConnection();
    const preparedStatement = await conn.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)');
    await preparedStatement.execute([username, password, email]);
  } catch (err) {
    throw err;
  } finally {
    conn?.release();
  }
}

export { createUser, findUserByUsername, findUserByEmail };
