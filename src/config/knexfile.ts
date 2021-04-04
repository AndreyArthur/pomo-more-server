import path from 'path';
import 'dotenv/config';

const {
  DB_NAME,
  TEST_DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  NODE_ENV,
} = process.env;

export default {
  client: 'pg',
  connection: {
    database: NODE_ENV === 'test'
      ? TEST_DB_NAME
      : DB_NAME,
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
  },
  migrations: {
    directory: NODE_ENV === 'production'
      ? path.resolve(
        __dirname, '..', '..', 'dist', 'shared', 'infra', 'knex', 'migrations',
      )
      : path.resolve(__dirname, '..', 'shared', 'infra', 'knex', 'migrations'),
  },
};
