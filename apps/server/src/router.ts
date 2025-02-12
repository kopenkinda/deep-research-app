import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import { updateSchema } from './schemas';

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
const router = t.router;
export const createCallerFactory = t.createCallerFactory;

export const appRouter = router({
  update: publicProcedure.input(updateSchema).mutation(() => {
  }),
  get: publicProcedure.query(() => {
    return {
        id: 4,
        status: 'active'
      }
  }),
});

export const createCaller = createCallerFactory(appRouter);
export type AppRouter = typeof appRouter;
