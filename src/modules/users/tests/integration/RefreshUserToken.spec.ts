import request from 'supertest';

import knex from '@shared/infra/knex';
import app from '@root/app';

describe('RefreshUserToken', () => {
  beforeAll(async () => {
    await knex.migrate.latest();

    await knex.raw('DELETE FROM users');
  });

  afterEach(async () => {
    await knex.raw('DELETE FROM users');
  });

  it('should refresh user token successfully', async () => {
    await request(app).post('/users/').send({
      username: 'lorem_ipsum',
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

    const { body: { token } } = await request(app).post('/sessions/').send({
      email: 'lorem@ipsum.com',
      password: 'lorem_ipsum',
    });

    const refreshedTokenResponse = await request(app).put('/sessions/').set({
      Authorization: `Bearer ${token}`,
    });

    expect(refreshedTokenResponse.status).toBe(200);
    expect(refreshedTokenResponse.body).toHaveProperty('token');
  });

  afterAll(async (done) => {
    await knex.raw('DELETE FROM users');

    knex.destroy();

    done();
  });
});
