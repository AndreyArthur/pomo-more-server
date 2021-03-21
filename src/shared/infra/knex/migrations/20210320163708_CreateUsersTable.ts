import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE users (
      id uuid DEFAULT uuid_generate_v4 () NOT NULL,
      username VARCHAR NOT NULL UNIQUE,
      email VARCHAR NOT NULL UNIQUE,
      password VARCHAR NOT NULL,
      created_at TIMESTAMP DEFAULT now (),
      updated_at TIMESTAMP DEFAULT now (),
      PRIMARY KEY (id)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE users;

    DROP EXTENSION IF EXISTS "uuid-ossp";
  `);
}
