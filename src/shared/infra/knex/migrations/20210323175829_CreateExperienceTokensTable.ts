import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
  CREATE TABLE experience_tokens (
      user_id UUID NOT NULL UNIQUE,
      next_password VARCHAR(16),
      CONSTRAINT fk_users_experience_token
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE experience_tokens;
  `);
}
