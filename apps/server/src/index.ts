import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { Hono } from 'hono';
import { createContext } from './context';
import { appRouter } from './router';

const app = new Hono();

app.all('/trpc/*', async (c) => {
  return await fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => createContext(c),
  });
});

export default app;
