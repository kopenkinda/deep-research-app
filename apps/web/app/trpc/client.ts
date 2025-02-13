import {
  createTRPCClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client";
import SuperJSON from "superjson";
import type { AppRouter } from "../../../server/src/router";

const transformer = new SuperJSON();

export const client = createTRPCClient<AppRouter>({
  links: [
    loggerLink(),
    splitLink({
      condition: (op) => op.type !== "subscription",
      true: httpBatchLink({
        transformer,
        url: "http://localhost:3000/trpc",
      }),
      false: unstable_httpSubscriptionLink({
        transformer,
        url: "http://localhost:3000/trpc",
      }),
    }),
  ],
});
