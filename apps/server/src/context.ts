import type { Context as HonoContext } from "hono";
import { setCookie } from "hono/cookie";
import type { BlankEnv, BlankInput } from "hono/types";
import db from "./db";
import { schemas } from "./db/schema";

export async function createContext(
  c?: HonoContext<BlankEnv, "/trpc/*", BlankInput>
) {
  return {
    c,
    setUserIdCookie: (userId: string) => {
      if (c === undefined) {
        return;
      }
      setCookie(c, "userId", userId, {});
    },
    db,
    schemas,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
