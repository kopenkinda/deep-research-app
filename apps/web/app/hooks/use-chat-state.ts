import { useEffect, useState } from "react";
import { trpc } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/router";

type ChatState = NonNullable<RouterOutputs["chat"]["getChat"]>["state"];

export function useChatState(chatId: number, defaultState: ChatState) {
  const [chatState, setChatState] = useState(defaultState);

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
