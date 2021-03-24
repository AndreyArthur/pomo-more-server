import ExperienceTokensRepository
  from '@modules/experience_tokens/repositories/ExperienceTokensRepository,';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUser';
import AppError from '@shared/exceptions/AppError';
import knex from '@shared/infra/knex';
import CreateTokenService
  from '@modules/experience_tokens/services/CreateToken';

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

    const createUser = new CreateUserService(usersRepository);

    const user = await createUser.execute({
      username: 'lorem_ipsum',
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

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

    const createUser = new CreateUserService(usersRepository);

    const user = await createUser.execute({
      username: 'lorem_ipsum',
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

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
        user_id: '1b151b20-6254-4b32-b398-dd6587016d46',
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
