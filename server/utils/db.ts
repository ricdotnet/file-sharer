import { Logger } from '@ricdotnet/logger/dist/index.js';
import mysql, { PoolOptions } from 'mysql2/promise';
import * as argon from 'argon2';
import { COOKIE_EXPIRE } from '~/utils/constants';

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
  } catch (err: any) {
    Logger.get()
          .error(`Error in findUserByUsername: ${err.message}`);
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
  } catch (err: any) {
    Logger.get()
          .error(`Error in findUserByEmail: ${err.message}`);
    throw err;
  } finally {
    conn?.release();
  }

  return rows;
}

async function findUserById(id: number) {
  let conn;
  let rows;

  try {
    conn = await db.getConnection();
    [rows] = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
  } catch (err: any) {
    Logger.get()
          .error(`Error in findUserById: ${err.message}`);
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
  } catch (err: any) {
    Logger.get()
          .error(`Error in createUser: ${err.message}`);
    throw err;
  } finally {
    conn?.release();
  }
}

async function createFile(userId: number, ogName: string, fileName: string,
                          options: { is_private: boolean, is_image: boolean }) {
  let conn;

  try {
    conn = await db.getConnection();
    const preparedStatement = await conn.prepare('INSERT INTO files (owner, original_filename, filename, is_private, is_image) VALUES (?, ?, ?, ?, ?)');
    await preparedStatement.execute([userId, ogName, fileName, options.is_private, options.is_image]);
  } catch (err: any) {
    Logger.get()
          .error(`Error in createFile: ${err.message}`);
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
  } catch (err: any) {
    Logger.get()
          .error(`Error in findFilesByUserId: ${err.message}`);
    throw err;
  } finally {
    conn?.release();
  }

  return rows;
}

async function findFileByFilename(filename: string) {
  let conn;
  let rows;

  try {
    conn = await db.getConnection();
    [rows] = await conn.query('SELECT * FROM files WHERE filename = ?', [filename]);
  } catch (err: any) {
    Logger.get()
          .error(`Error in findFileByFilename: ${err.message}`);
    throw err;
  } finally {
    conn?.release();
  }

  return rows;
}

async function deleteFileById(owner: number, id: number) {
  let rows;
  let conn;

  try {
    conn = await db.getConnection();
    [rows] = await conn.query('SELECT * FROM files WHERE id = ? and owner = ?', [id, owner]);
    const preparedStatement = await conn.prepare('DELETE FROM files WHERE id = ? and owner = ?');
    await preparedStatement.execute([id, owner]);
  } catch (err: any) {
    Logger.get()
          .error(`Error in deleteFileById: ${err.message}`);
    throw err;
  } finally {
    conn?.release();
  }

  return rows;
}

async function updateFileById(owner: number, id: number, isPrivate: boolean) {
  let conn;

  try {
    conn = await db.getConnection();
    const preparedStatement = await conn.prepare('UPDATE files SET is_private = ? WHERE owner = ? and id = ?');
    await preparedStatement.execute([isPrivate, owner, id]);
  } catch (err: any) {
    Logger.get()
          .error(`Error in updateFileById: ${err.message}`);
    throw err;
  } finally {
    conn?.release();
  }
}

async function saveCookie(owner: number, cookie: string, refreshToken: string) {
  let conn;

  try {
    conn = await db.getConnection();
    const preparedStatement = await conn.prepare('INSERT INTO cookies (owner, value, expires, refresh_token) VALUES (?, ?, ?, ?)');
    await preparedStatement.execute([owner, cookie, COOKIE_EXPIRE, refreshToken]);
  } catch (err: any) {
    Logger.get()
          .error(`Error in saveCookie: ${err.message}`);
    throw err;
  } finally {
    conn?.release();
  }
}

async function updateCookie(oldCookie: string, cookie: string, refreshToken: string) {
  let conn;

  try {
    conn = await db.getConnection();
    const preparedStatement = await conn.prepare('UPDATE cookies SET value = ?, expires = ?, refresh_token = ? WHERE value = ?');
    await preparedStatement.execute([cookie, COOKIE_EXPIRE, refreshToken, oldCookie]);
  } catch (err: any) {
    Logger.get()
          .error(`Error in updateCookie: ${err.message}`);
    throw err;
  } finally {
    conn?.release();
  }
}

async function deleteCookieByValue(value: string) {
  let conn;

  try {
    conn = await db.getConnection();
    const preparedStatement = await conn.prepare('DELETE FROM cookies WHERE value = ?');
    await preparedStatement.execute([value]);
  } catch (err: any) {
    Logger.get()
          .error(`Error in deleteCookie: ${err.message}`);
    throw err;
  } finally {
    conn?.release();
  }
}

async function findCookie(cookie: string) {
  let conn;
  let rows;

  try {
    conn = await db.getConnection();
    [rows] = await conn.query('SELECT * FROM cookies WHERE value = ?', [cookie]);
  } catch (err: any) {
    Logger.get()
          .error(`Error in findCookie: ${err.message}`);
    throw err;
  } finally {
    conn?.release();
  }

  return rows;
}

async function clearExpiredCookies() {
  let conn;

  try {
    conn = await db.getConnection();
    await conn.query('DELETE FROM cookies WHERE expires < NOW() - INTERVAL 1 HOUR');
  } catch (err: any) {
    Logger.get()
          .error(`Error in clearExpiredCookies: ${err.message}`);
    throw err;
  } finally {
    conn?.release();
  }
}

export {
  createUser,
  findUserByUsername,
  findUserByEmail,
  findUserById,
  createFile,
  findFilesByUserId,
  findFileByFilename,
  deleteFileById,
  updateFileById,
  saveCookie,
  updateCookie,
  deleteCookieByValue,
  findCookie,
  clearExpiredCookies,
};
