import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Get Statement Operation Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to statement operation', async () => {
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

    const responseDeposit = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 300,
        description: 'Deposit description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const statementId = await responseDeposit.body.id;

    const response = await request(app)
      .get(`/api/v1/statements/${statementId}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toEqual('deposit');
    expect(response.body.id).toEqual(statementId);
  });
});
