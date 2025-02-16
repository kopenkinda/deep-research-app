import { useEffect, useState } from "react";
import { redirect } from "react-router";
import { ChatFollowupQuestions } from "~/components/chat/followup-questions";
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
  const isGenerating = chatState.includes("generating");
  console.log(loaderData.chat);
  const { data } = trpc.chat.getChat.useQuery(
    { id: loaderData.chat.id },
    {
      refetchInterval: 1000,
      enabled: isGenerating,
    }
  );

  useEffect(() => {
    if (data !== undefined) {
      setChatState(data.state);
    }
  }, [data]);

  return (
    <>
      {(chatState === "follow-up-required" ||
        chatState === "generating-followups") && (
        <ChatFollowupQuestions
          chatId={loaderData.chat.id}
          isLoading={chatState === "generating-followups"}
        />
      )}
    </>
  );
}
