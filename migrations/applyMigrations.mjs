import fs from 'fs';
import { createConnection } from 'mysql2/promise';

const access = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
};

const connection = await createConnection(access);

const migrationFunctions = [];

function run() {
  fs.readdir('./migrations', async (err, files) => {
    const _files = files.filter((file) => file.endsWith('.sql')).sort((a, b) => +a.split('_')[0] - +b.split('_')[0]);

    for (let file of _files) {
      const sql = fs.readFileSync(`./migrations/${file}`, 'utf8');

      try {
        await connection.query(sql);
        console.log(`Migration ${file} applied`);
      } catch (err) {
        console.error(`Migration ${file} failed: ${err.message}`);
      }
    }

    const start = Date.now();
    console.log('Applying migration functions now');

    for (const mf of migrationFunctions) {
      await mf();
    }

    const timeEnd = Date.now() - start;
    console.log(`Applied migration functions in ${timeEnd}ms`);

    connection.end();
    process.exit(0);
  });
}

migrationFunctions.push(async () => {
  console.log('Populating user upload defaults');

  const [users] = await connection.query('SELECT id FROM users WHERE id NOT IN (SELECT user FROM user_upload_defaults)');
  
  for (const user of users) {
    await connection.query(`INSERT INTO user_upload_defaults (user) VALUES (${user.id})`);
  }
});

run();
