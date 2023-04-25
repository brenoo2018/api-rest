import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { transactionsRoutes } from './routes/transactions';

const app = fastify();

app.register(cookie);

// app.addHook('preHandler', async (req, res) => {

// })

app.register(transactionsRoutes, { prefix: 'transactions' });

app.listen({ port: 3333 }).then(() => {
  console.log('http server running');
});
