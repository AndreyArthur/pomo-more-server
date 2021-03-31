import knex from '@shared/infra/knex';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import FindUsersService from '@modules/users/services/FindUsers';
import createUser from '@modules/users/tests/utils/createUser';
import { v4 } from 'uuid';
import AppError from '@shared/exceptions/AppError';

describe('FindUsers', () => {
  beforeAll(async () => {
    await knex.raw('DELETE FROM users');

    await knex.migrate.latest();
  });

  afterEach(async () => {
    await knex.raw('DELETE FROM users');
  });

  it('should find a single user', async () => {
    await createUser();
    const secondUser = await createUser();
    await createUser();

    const usersRepository = new UsersRepository();

    const findUsers = new FindUsersService(usersRepository);

    const users = await findUsers.execute({
      user_id: secondUser.id,
    });

    expect(users).toHaveLength(1);
    expect(users[0].username).toBe(secondUser.username);
  });

  it('should find all users', async () => {
    await createUser();
    await createUser();
    await createUser();

    const usersRepository = new UsersRepository();

    const findUsers = new FindUsersService(usersRepository);

    const users = await findUsers.execute({ user_id: undefined });

    expect(users).toHaveLength(3);
  });

  it('should throw an error because searched user not exists', async () => {
    const usersRepository = new UsersRepository();

    const findUsers = new FindUsersService(usersRepository);

    try {
      await findUsers.execute({ user_id: v4() });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toBe('User not exists');
    }
  });

  afterAll(async (done) => {
    await knex.raw('DELETE FROM users');

    knex.destroy();

    done();
  });
});
