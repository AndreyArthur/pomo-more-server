import UsersRepository from '@modules/users/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUser';
import knex from '@shared/infra/knex';
import RefreshTokenService from '@modules/users/services/RefreshToken';
import AppError from '@shared/exceptions/AppError';

describe('CreateUser', () => {
  beforeAll(async () => {
    await knex.raw('DELETE FROM users');

    await knex.migrate.latest();
  });

  afterEach(async () => {
    await knex.raw('DELETE FROM users');
  });

  it('should refresh token successfully', async () => {
    const usersRepository = new UsersRepository();

    const createUser = new CreateUserService(usersRepository);

    const createdUser = await createUser.execute({
      username: 'lorem_ipsum',
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

    const refreshToken = new RefreshTokenService(usersRepository);

    const { user, token } = await refreshToken.execute({
      user_id: createdUser.id,
    });

    expect(user.username).toBe('lorem_ipsum');
    expect(!!token).toBe(true);
  });

  it('should throw an error because user is not authenticated', async () => {
    const usersRepository = new UsersRepository();

    const refreshToken = new RefreshTokenService(usersRepository);

    try {
      await refreshToken.execute({
        user_id: '098f2b0d-29fb-4f85-adb8-bbcb4955c897',
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
