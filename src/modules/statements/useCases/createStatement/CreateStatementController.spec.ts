import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Create Statement Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a deposit statement', async () => {
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
      .post('/api/v1/statements/deposit')
      .send({
        amount: 300,
        description: 'Deposit description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.type).toEqual('deposit');
  });

  it('Should be able to create a withdraw statement', async () => {
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
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 300,
        description: 'Withdraw description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.type).toEqual('withdraw');
  });

  it('Should not be able to make a withdraw when there is no enough balance', async () => {
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

    await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 300,
        description: 'Deposit description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 400,
        description: 'Withdraw description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
