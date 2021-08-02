import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new user session', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'user',
      email: 'email@finapi.com',
      password: 'password',
    });

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'email@finapi.com',
      password: 'password',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('Should not be able to create a new user session with wrong email', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'user',
      email: 'email@finapi.com',
      password: 'password',
    });

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'emailincorrect@finapi.com',
      password: 'password',
    });

    expect(response.status).toBe(401);
  });

  it('Should not be able to create a new user session with wrong password', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'user',
      email: 'email@finapi.com',
      password: 'password',
    });

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'email@finapi.com',
      password: 'password-incorrect',
    });

    expect(response.status).toBe(401);
  });
});
