import knex from '@shared/infra/knex';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUser';
import createUser from '@modules/users/tests/utils/createUser';
import AppError from '@shared/exceptions/AppError';

describe('CreateUser', () => {
  beforeAll(async () => {
    await knex.raw('DELETE FROM users');

    await knex.migrate.latest();
  });

  afterEach(async () => {
    await knex.raw('DELETE FROM users');
  });

  beforeAll(async () => {
    await knex.raw('DELETE FROM users');

    await knex.migrate.latest();
  });

  afterEach(async () => {
    await knex.raw('DELETE FROM users');
  });

  it('should create a user successfully', async () => {
    const user = await createUser();

    expect(user.username).toHaveLength(12);
  });

  it('should throw an error because username is in use', async () => {
    const usersRepository = new UsersRepository();

    const createUserService = new CreateUserService(usersRepository);

    const user = await createUser();

    try {
      await createUserService.execute({
        username: user.username,
        email: user.email,
        password: user.originalPassword,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toBe('Username is already in use');
    }
  });

  it('should throw an error because email is in use', async () => {
    const usersRepository = new UsersRepository();

    const createUserService = new CreateUserService(usersRepository);

    const user = await createUser();

    try {
      await createUserService.execute({
        username: user.username + user.username,
        email: user.email,
        password: user.originalPassword,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toBe('Account already exists');
    }
  });

  afterAll(async (done) => {
    await knex.raw('DELETE FROM users');

    knex.destroy();

    done();
  });
});
