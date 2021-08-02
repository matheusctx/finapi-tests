import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Show User Profile Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to show a user profile', async () => {
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
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toEqual('email@finapi.com');
  });

  it('Should not be able to show a user profile with a non-existent token authentication', async () => {
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
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer ${token}xxx`,
      });

    expect(response.status).toBe(401);
  });
});
