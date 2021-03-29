import request from 'supertest';

import knex from '@shared/infra/knex';
import app from '@root/app';

describe('CreateAndAuthenticadeUser', () => {
  beforeAll(async () => {
    await knex.migrate.latest();

    await knex.raw('DELETE FROM users');
  });

  afterEach(async () => {
    await knex.raw('DELETE FROM users');
  });

  it('should create and authenticate user successfully', async () => {
    await request(app).post('/users/').send({
      username: 'lorem_ipsum',
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

    const sessionResponse = await request(app).post('/sessions/').send({
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

    expect(sessionResponse.body.user.username).toBe('lorem_ipsum');
    expect(sessionResponse.body).toHaveProperty('token');
    expect(sessionResponse.status).toBe(200);
  });

  afterAll(async (done) => {
    await knex.raw('DELETE FROM users');

    knex.destroy();

    done();
  });
});
