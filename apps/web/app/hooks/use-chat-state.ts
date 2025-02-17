import { useEffect, useState } from "react";
import { trpc } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/router";

export type ChatState = NonNullable<RouterOutputs["chat"]["getChat"]>["state"];

export function useChatState(chatId: number, initialState: ChatState) {
  const [chatState, setChatState] = useState(initialState);
  const [analysis, setAnalysis] = useState<string | undefined>(undefined);

  const { data, refetch } = trpc.chat.getChat.useQuery(
    { id: chatId },
    {
      refetchInterval: 1000,
      enabled:
        chatState.includes("generating") ||
        (chatState === "finished" && analysis === undefined),
    }
  );

  useEffect(() => {
    if (data !== undefined) {
      setChatState(data.state);
      setAnalysis(data.analysis ?? undefined);
    }
  }, [data]);

  return [{ chatState, analysis }, refetch] as const;
}
