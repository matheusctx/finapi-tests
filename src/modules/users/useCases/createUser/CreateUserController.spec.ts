import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'Name Test',
      email: 'email@test.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
  });

  it('Should not be able to create a new user when email is already taken', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Name Test 2',
      email: 'email@test2.com',
      password: '123456',
    });

    const response = await request(app).post('/api/v1/users').send({
      name: 'Name Test 2',
      email: 'email@test2.com',
      password: '654321',
    });

    expect(response.status).toBe(400);
  });
});
