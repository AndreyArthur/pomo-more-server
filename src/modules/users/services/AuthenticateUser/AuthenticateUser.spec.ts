import knex from '@shared/infra/knex';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUser';
import CreateUserService from '@modules/users/services/CreateUser';
import AppError from '@shared/exceptions/AppError';

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

    const createUser = new CreateUserService(usersRepository);

    await createUser.execute({
      username: 'lorem_ipsum',
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

    const authenticateUser = new AuthenticateUserService(usersRepository);

    const { user, token } = await authenticateUser.execute({
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

    expect(!!token).toBe(true);
    expect(user.username).toBe('lorem_ipsum');
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

    const createUser = new CreateUserService(usersRepository);

    await createUser.execute({
      username: 'lorem_ipsum',
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

    try {
      await authenticateUser.execute({
        email: 'lorem@ipsum.com',
        password: 'lorem_ipsum_dolor',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
    }
  });

  afterAll((done) => {
    knex.raw('DELETE FROM users');

    knex.destroy();

    done();
  });
});
