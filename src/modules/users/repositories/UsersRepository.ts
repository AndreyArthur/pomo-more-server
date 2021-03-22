import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import knex from '@shared/infra/knex';
import User from '@modules/users/models/User';

export default class UsersRepository implements IUsersRepository {
  public async findByEmail(email: string): Promise<User | undefined> {
    const users = await knex.raw(
      'SELECT * FROM users WHERE email = ?', [email],
    );

    const user = users.rows[0];

    return users ? user : undefined;
  }

  public async findByUsername(username: string): Promise<User | undefined> {
    const users = await knex.raw(
      'SELECT * FROM users WHERE username = ?', [username],
    );

    const user = users.rows[0];

    return users ? user : undefined;
  }

  public async findById(id: string): Promise<User | undefined> {
    const users = await knex.raw(
      'SELECT * FROM users WHERE id = ?', [id],
    );

    const user = users.rows[0];

    return users ? user : undefined;
  }

  public async save(
    {
      username,
      email,
      password,
    }: Pick<Required<User>, 'username' | 'password' | 'email'>,
  ): Promise<User> {
    const users = await knex.raw(`
      INSERT INTO users (
        username,
        email,
        password
      ) VALUES (
        ?,
        ?,
        ?
      ) RETURNING *;
    `, [username, email, password]);

    return users.rows[0];
  }
}
