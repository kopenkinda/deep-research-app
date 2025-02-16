import type { skipToken } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { UseTRPCSubscriptionOptions } from "@trpc/react-query/shared";
import type { DefaultErrorShape } from "@trpc/server/unstable-core-do-not-import";
import { useMemo } from "react";
import { trpc } from "~/trpc/react";
import type { RouterInputs } from "~/trpc/router";

export function useResearchSubscription(
  chatId: RouterInputs["chat"]["generate"] | typeof skipToken,
  options: UseTRPCSubscriptionOptions<
    number,
    TRPCClientErrorLike<{
      input: RouterInputs["chat"]["generate"];
      transformer: true;
      errorShape: DefaultErrorShape;
    }>
  >
) {
  const subscription = useMemo(() => trpc.chat.generate.useSubscription, []);
  return subscription(chatId, options);
}
