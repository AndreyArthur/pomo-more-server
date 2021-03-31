import knex from '@shared/infra/knex';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUser';
import AppError from '@shared/exceptions/AppError';
import createUser from '@modules/users/tests/utils/createUser';

describe('AuthenticateUser', () => {
  beforeAll(async () => {
    await knex.migrate.latest();

    await knex.raw('DELETE FROM users');
  });

  afterEach(async () => {
    await knex.raw('DELETE FROM users');
  });

  it('should authenticate an user successfully', async () => {
    const usersRepository = new UsersRepository();

    const createdUser = await createUser();

    const authenticateUser = new AuthenticateUserService(usersRepository);

    const { user, token } = await authenticateUser.execute({
      email: createdUser.email,
      password: createdUser.originalPassword,
    });

    expect(!!token).toBe(true);
    expect(user.username).toBe(createdUser.username);
  });

  it('should throw an error because user not exists', async () => {
    const usersRepository = new UsersRepository();

    const authenticateUser = new AuthenticateUserService(usersRepository);

    try {
      await authenticateUser.execute({
        email: 'lorem@ipsum.com',
        password: 'lorem_ipsum',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
    }
  });

  it('should throw an error because password is wrong', async () => {
    const usersRepository = new UsersRepository();

    const authenticateUser = new AuthenticateUserService(usersRepository);

    const user = await createUser();

    try {
      await authenticateUser.execute({
        email: user.email,
        password: user.originalPassword + user.originalPassword,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
    }
  });

  afterAll(async (done) => {
    await knex.raw('DELETE FROM users');

    knex.destroy();

    done();
  });
});
