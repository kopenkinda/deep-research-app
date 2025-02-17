import { useEffect, useState } from "react";
import { trpc } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/router";

export type ChatState = NonNullable<RouterOutputs["chat"]["getChat"]>["state"];

export function useChatState(chatId: number, initialState: ChatState) {
  const [chatState, setChatState] = useState(initialState);

  const { data, refetch } = trpc.chat.getChat.useQuery(
    { id: chatId },
    {
      refetchInterval: 1000,
      enabled: chatState.includes("generating"),
    }
  );

  useEffect(() => {
    if (data !== undefined) {
      setChatState(data.state);
    }
  }, [data]);

  return [chatState, refetch] as const;
}
