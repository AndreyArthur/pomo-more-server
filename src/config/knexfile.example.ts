import path from 'path';

export default {
  client: 'pg',
  connection: {
    database: process.env.NODE_ENV === 'test'
      ? 'pomo_more_test'
      : 'pomo_more',
    host: 'localhost',
    port: 5432,
    user: '',
    password: '',
  },
  migrations: {
    directory:
      path.resolve(__dirname, '..', 'shared', 'infra', 'knex', 'migrations'),
  },
};
