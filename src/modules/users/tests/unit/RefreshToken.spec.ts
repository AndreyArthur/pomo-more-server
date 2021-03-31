import { v4 } from 'uuid';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import createUser from '@modules/users/tests/utils/createUser';
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

    const createdUser = await createUser();

    const refreshToken = new RefreshTokenService(usersRepository);

    const { user, token } = await refreshToken.execute({
      user_id: createdUser.id,
    });

    expect(user.username).toBe(createdUser.username);
    expect(!!token).toBe(true);
  });

  it('should throw an error because user is not authenticated', async () => {
    const usersRepository = new UsersRepository();

    const refreshToken = new RefreshTokenService(usersRepository);

    try {
      await refreshToken.execute({
        user_id: v4(),
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
