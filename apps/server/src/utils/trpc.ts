import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import type { Context } from "../context";

const transformer = new SuperJSON();
const t = initTRPC.context<Context>().create({ transformer });

export const publicProcedure = t.procedure;

export const router = t.router;

export const createCallerFactory = t.createCallerFactory;
