import { initTRPC } from "@trpc/server";
import { count } from "drizzle-orm";
import SuperJSON from "superjson";
import { z } from "zod";
import type { Context } from "./context";
import { updateSchema } from "./schemas";
import { zAsyncIterable } from "./utils/zod-async-iterable";

const transformer = new SuperJSON();
const t = initTRPC.context<Context>().create({
  transformer,
});

const publicProcedure = t.procedure;
const router = t.router;
export const createCallerFactory = t.createCallerFactory;

export const appRouter = router({
  update: publicProcedure.input(updateSchema).mutation(() => {}),
  get: publicProcedure.query(() => {
    return { id: 4, status: "active" };
  }),
  count: publicProcedure.query(async ({ ctx: { db, schemas } }) => {
    const result = await db
      .select({ count: count() })
      .from(schemas.researchTable);
    return result[0].count;
  }),
  stream: publicProcedure
    .output(zAsyncIterable({ yield: z.number() }))
    .subscription(async function* handler({ ctx }) {
      for (let i = 0; i < 100; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (i > 50) {
          return;
        }
        yield i;
      }
    }),
});

export const createCaller = createCallerFactory(appRouter);
export type AppRouter = typeof appRouter;
