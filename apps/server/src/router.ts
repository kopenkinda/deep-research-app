import { chatRouter } from "./routers/chat.router";
import { researchDocumentRouter } from "./routers/documents.router";
import { createCallerFactory, router } from "./utils/trpc";

export const appRouter = router({
  chat: chatRouter,
  researchDocument: researchDocumentRouter,
});

export const createCaller = createCallerFactory(appRouter);
export type AppRouter = typeof appRouter;
