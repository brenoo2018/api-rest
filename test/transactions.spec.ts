import { expect, it, beforeAll, afterAll, describe } from 'vitest';
import request from 'supertest';

import { app } from '../src/app';

describe('transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('shloud be able to create a new transaction', async () => {
    //executar a função
    //esperar que a função tenha o resultado desejado

    const response = await request(app.server).post('/transactions').send({
      title: 'new transactions',
      amount: 500,
      type: 'credit',
    });

    expect(response.statusCode).toEqual(201);
  });

  it('shloud be able to list all transactions', async () => {
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
});
