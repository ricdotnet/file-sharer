import fs from 'fs';
import { createConnection } from "mysql2/promise";

const access = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
};

const connection = await createConnection(access);

fs.readdir('./migrations', async (err, files) => {
  const _files = files
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => +a.split('_')[0] - +b.split('_')[0]);

  for (let file of _files) {
    const sql = fs.readFileSync(`./migrations/${file}`, 'utf8');

    try {
      await connection.query(sql);
      console.log(`Migration ${file} applied`);
    } catch (err) {
      console.error(`Migration ${file} failed: ${err.message}`);
    }
  }

  connection.end();
  process.exit(0);
});
