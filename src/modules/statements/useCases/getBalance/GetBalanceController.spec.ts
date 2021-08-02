import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Get Balance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to get balance', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'user',
      email: 'email@finapi.com',
      password: 'password',
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'email@finapi.com',
      password: 'password',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.balance).toEqual(0);
  });

  it('Should not be able to get balance if not authenticated', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'user',
      email: 'email@finapi.com',
      password: 'password',
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'email@finapi.com',
      password: 'password',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer ${token}xxx`,
      });

    expect(response.status).toBe(401);
  });
});
