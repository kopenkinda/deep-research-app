import { useEffect, useState } from "react";
import { redirect } from "react-router";
import { ChatFollowupQuestions } from "~/components/chat/followup-questions";
import { ProgressVisualiser } from "~/components/chat/visualiser";
import { client } from "~/trpc/client";
import { trpc } from "~/trpc/react";
import type { Route } from "./+types/_chat.chat.$id";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const chatId = +params.id;
  if (Number.isNaN(chatId)) {
    return redirect("/chat");
  }
  const chat = await client.chat.getChat.query({ id: chatId });
  if (chat === undefined) {
    return redirect("/chat");
  }
  return { chat };
};

export default function ChatPage({ loaderData }: Route.ComponentProps) {
  const [chatState, setChatState] = useState(loaderData.chat.state);
  const { data, isFetching } = trpc.chat.getChat.useQuery(
    { id: loaderData.chat.id },
    {
      refetchInterval: 1000,
      enabled: chatState === "setup",
    }
  );

  useEffect(() => {
    if (data !== undefined) {
      setChatState(data.state);
    }
  }, [data]);

  return (
    <>
      {isFetching && <ProgressVisualiser />}
      {chatState === "follow-up-required" && (
        <ChatFollowupQuestions chatId={loaderData.chat.id} />
      )}
    </>
  );
}
