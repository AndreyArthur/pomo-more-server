import { v4 } from 'uuid';

import ExperienceTokensRepository
  from '@modules/experience_tokens/repositories/ExperienceTokensRepository,';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import AppError from '@shared/exceptions/AppError';
import knex from '@shared/infra/knex';
import CreateTokenService
  from '@modules/experience_tokens/services/CreateToken';
import createUser from '@modules/users/tests/utils/createUser';

describe('CreateToken', () => {
  beforeAll(async () => {
    await knex.migrate.latest();

    await knex.raw('DELETE FROM users');
    await knex.raw('DELETE FROM experience_tokens');
  });

  afterEach(async () => {
    await knex.raw('DELETE FROM users');
    await knex.raw('DELETE FROM experience_tokens');
  });

  it('should create first user experience token', async () => {
    const usersRepository = new UsersRepository();
    const experienceTokensRepository = new ExperienceTokensRepository();

    const user = await createUser();

    const createToken = new CreateTokenService(
      experienceTokensRepository, usersRepository,
    );

    const token = await createToken.execute({
      timeInMinutes: 30,
      user_id: user.id,
    });

    expect(typeof token === 'string').toBe(true);
  });

  it('should create another user experience token', async () => {
    const usersRepository = new UsersRepository();
    const experienceTokensRepository = new ExperienceTokensRepository();

    const user = await createUser();

    const createToken = new CreateTokenService(
      experienceTokensRepository, usersRepository,
    );

    await createToken.execute({
      timeInMinutes: 30,
      user_id: user.id,
    });

    const token = await createToken.execute({
      timeInMinutes: 30,
      user_id: user.id,
    });

    expect(typeof token === 'string').toBe(true);
  });

  it('should throw an error because user is not authenticated', async () => {
    const usersRepository = new UsersRepository();
    const experienceTokensRepository = new ExperienceTokensRepository();

    const createToken = new CreateTokenService(
      experienceTokensRepository, usersRepository,
    );

    try {
      await createToken.execute({
        timeInMinutes: 30,
        user_id: v4(),
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
    }
  });

  afterAll(async (done) => {
    await knex.raw('DELETE FROM users');
    await knex.raw('DELETE FROM experience_tokens');

    knex.destroy();

    done();
  });
});
