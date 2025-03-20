import { createConnection } from 'mysql2/promise';
import * as argon from 'argon2';

const access = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
};

const connection = await createConnection(access);

async function tearDown() {
  const start = Date.now();
  console.log('Preparing to tear down ...');

  const deleteCookies = 'DELETE FROM cookies';
  const deleteUsers = 'DELETE FROM users';
  const deleteFiles = 'DELETE FROM files';

  await connection.query(deleteCookies);
  await connection.query(deleteFiles);
  await connection.query(deleteUsers);

  const totalTime = Date.now() - start;
  console.log(`Teardown complete in: ${totalTime}ms`);
}

async function seed() {
  const start = Date.now();
  console.log('Preparing to seed ...');

  const hashedPass = await argon.hash('password_');
  const userQ = `INSERT INTO users (id, username, password, email) VALUES (1, 'ricdotnet', '${hashedPass}', 'e@mail.com')`;
  const userDefaults = 'INSERT INTO user_upload_defaults (user) VALUES (1)';

  await connection.query(userQ);
  await connection.query(userDefaults);

  const totalTime = Date.now() - start;
  console.log(`Seeding complete in: ${totalTime}ms`);
}

await tearDown();
await seed();

connection.end();

process.exit(0);