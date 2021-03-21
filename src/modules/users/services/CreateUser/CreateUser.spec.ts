import knex from '@shared/infra/knex';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUser';
import AppError from '@shared/exceptions/AppError';

describe('CreateUser', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
  });

  afterEach(async () => {
    await knex.raw('DELETE FROM users');
  });

  it('should create a user successfully', async () => {
    const usersRepository = new UsersRepository();

    const createUser = new CreateUserService(usersRepository);

    const user = await createUser.execute({
      username: 'loremipsum',
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

    expect(user.username).toBe('loremipsum');
  });

  it('should throw an error because username is in use', async () => {
    const usersRepository = new UsersRepository();

    const createUser = new CreateUserService(usersRepository);

    await createUser.execute({
      username: 'loremipsum',
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

    try {
      await createUser.execute({
        username: 'loremipsum',
        email: 'lorem@ipsum.com',
        password: 'lorem_ipsum',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toBe('Username is already in use');
    }
  });

  it('should throw an error because email is in use', async () => {
    const usersRepository = new UsersRepository();

    const createUser = new CreateUserService(usersRepository);

    await createUser.execute({
      username: 'loremipsum',
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

    try {
      await createUser.execute({
        username: 'loremipsum2',
        email: 'lorem@ipsum.com',
        password: 'lorem_ipsum',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toBe('Account already exists');
    }
  });

  afterAll((done) => {
    knex.destroy();
    done();
  });
});
