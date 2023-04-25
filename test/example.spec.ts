import { expect, test, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import { app } from '../src/app';

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test('user can create a new transaction', async () => {
  //executar a função
  //esperar que a função tenha o resultado desejado

  const response = await request(app.server).post('/transactions').send({
    title: 'new transactions',
    amount: 500,
    type: 'credit',
  });

  expect(response.statusCode).toEqual(201);
});
