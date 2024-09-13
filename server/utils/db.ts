import { Logger } from '@ricdotnet/logger/dist';
import mysql, { PoolOptions } from 'mysql2/promise';
import * as argon from 'argon2';

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
    Logger.get().error('Error in findUserByUsername');
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
    Logger.get().error('Error in findUserByEmail');
    throw err;
  } finally {
    conn?.release();
  }

  return rows;
}

async function createUser(username: string, password: string, email: string) {
  let conn;
  
  const hashedPass = await argon.hash(password);

  try {
    conn = await db.getConnection();
    const preparedStatement = await conn.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)');
    await preparedStatement.execute([username, hashedPass, email]);
  } catch (err) {
    Logger.get().error('Error in createUser');
    throw err;
  } finally {
    conn?.release();
  }
}

async function createFile(userId: number, ogName: string, fileName: string) {
  let conn;

  try {
    conn = await db.getConnection();
    const preparedStatement = await conn.prepare('INSERT INTO files (owner, original_filename, filename) VALUES (?, ?, ?)');
    await preparedStatement.execute([userId, ogName, fileName]);
  } catch (err) {
    Logger.get().error('Error in createFile');
    throw err;
  } finally {
    conn?.release();
  }
}

async function findFilesByUserId(userId: number) {
  let conn;
  let rows;

  try {
    conn = await db.getConnection();
    [rows] = await conn.query('SELECT * FROM files WHERE owner = ?', [userId]);
  } catch (err) {
    Logger.get().error('Error in findFilesByUserId');
    throw err;
  } finally {
    conn?.release();
  }

  return rows;
}

export { createUser, findUserByUsername, findUserByEmail, createFile, findFilesByUserId };
