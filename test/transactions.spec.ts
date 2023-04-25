import {
  expect,
  it,
  beforeAll,
  afterAll,
  describe,
  beforeEach,
  afterEach,
} from 'vitest';
import request from 'supertest';
import { execSync } from 'node:child_process';

import { app } from '../src/app';

describe('transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('should be able to create a new transaction', async () => {
    //executar a função
    //esperar que a função tenha o resultado desejado

    const response = await request(app.server).post('/transactions').send({
      title: 'new transactions',
      amount: 500,
      type: 'credit',
    });

    expect(response.statusCode).toEqual(201);
  });

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transactions',
        amount: 500,
        type: 'credit',
      });

    const cookie = createTransactionResponse.get('Set-Cookie');

    const responseListAllTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie);

    // expect(responseListAllTransactionsResponse.statusCode).toEqual(200);
    expect(responseListAllTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'new transactions',
        amount: 500,
      }),
    ]);
  });

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'credit transactions',
        amount: 500,
        type: 'credit',
      });

    const cookie = createTransactionResponse.get('Set-Cookie');

    await request(app.server).post('/transactions').set('Cookie', cookie).send({
      title: 'debit transactions',
      amount: 150,
      type: 'debit',
    });

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie);

    expect(summaryResponse.body.summary).toEqual({
      amount: 350,
    });
  });

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200);

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      })
    );
  });
});
