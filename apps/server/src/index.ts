import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createContext } from "./context";
import { appRouter } from "./router";

const app = new Hono();

app.use(cors({ origin: "*" }));

app.all("/trpc/*", async (c) => {
  return await fetchRequestHandler({
    endpoint: "/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: () => createContext(c),
  });
});

export default app;
