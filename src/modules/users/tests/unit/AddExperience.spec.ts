import { v4 } from 'uuid';

import knex from '@shared/infra/knex';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import ExperienceTokensRepository
  from '@modules/experience_tokens/repositories/ExperienceTokensRepository,';
import CreateTokenService from
  '@modules/experience_tokens/services/CreateToken';
import AddExperienceService
  from '@modules/users/services/AddExperience';
import AppError from '@shared/exceptions/AppError';
import decodeExperienceToken
  from '@modules/users/tests/utils/decodeExperienceToken';
import createUser from '@modules/users/tests/utils/createUser';

describe('AddExperience', () => {
  beforeAll(async () => {
    await knex.migrate.latest();

    await knex.raw('DELETE FROM users');
    await knex.raw('DELETE FROM experience_tokens');
  });

  afterEach(async () => {
    await knex.raw('DELETE FROM users');
    await knex.raw('DELETE FROM experience_tokens');
  });

  it('should add user experience successfully', async () => {
    const usersRepository = new UsersRepository();
    const experienceTokensRepository = new ExperienceTokensRepository();

    const user = await createUser();

    const createToken = new CreateTokenService(
      experienceTokensRepository, usersRepository,
    );

    const token = await createToken.execute({
      user_id: user.id,
      timeInMinutes: 30,
    });

    const { password, user_id, points } = decodeExperienceToken(token);

    const addExperience = new AddExperienceService(
      usersRepository, experienceTokensRepository,
    );

    const updatedUser = await addExperience.execute({
      password,
      user_id,
      points,
    });

    expect(updatedUser.experience).toBe(120);
  });

  it('should throw an error because user is not authenticated', async () => {
    const usersRepository = new UsersRepository();
    const experienceTokensRepository = new ExperienceTokensRepository();

    const user = await createUser();

    const createToken = new CreateTokenService(
      experienceTokensRepository, usersRepository,
    );

    const token = await createToken.execute({
      user_id: user.id,
      timeInMinutes: 30,
    });

    const { password, points } = decodeExperienceToken(token);

    const addExperience = new AddExperienceService(
      usersRepository, experienceTokensRepository,
    );

    try {
      await addExperience.execute({
        password,
        user_id: v4(),
        points,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
    }
  });

  it('should throw an error because token password did not match', async () => {
    const usersRepository = new UsersRepository();
    const experienceTokensRepository = new ExperienceTokensRepository();

    const user = await createUser();

    const createToken = new CreateTokenService(
      experienceTokensRepository, usersRepository,
    );

    const token = await createToken.execute({
      user_id: user.id,
      timeInMinutes: 30,
    });

    const { user_id, points } = decodeExperienceToken(token);

    const addExperience = new AddExperienceService(
      usersRepository, experienceTokensRepository,
    );

    try {
      await addExperience.execute({
        password: v4(),
        user_id,
        points,
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
