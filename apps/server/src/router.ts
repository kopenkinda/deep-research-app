import { chatRouter } from "./routers/chat.router";
import { createCallerFactory, router } from "./utils/trpc";

export const appRouter = router({
  chat: chatRouter,
});

export const createCaller = createCallerFactory(appRouter);
export type AppRouter = typeof appRouter;
