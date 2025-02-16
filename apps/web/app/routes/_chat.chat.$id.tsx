import { skipToken } from "@tanstack/react-query";
import { redirect } from "react-router";
import { ChatFollowupQuestions } from "~/components/chat/followup-questions";
import { useChatState } from "~/hooks/use-chat-state";
import { useResearchSubscription } from "~/hooks/use-research-subscription";
import { client } from "~/trpc/client";
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
  const [chatState, refetchState] = useChatState(
    loaderData.chat.id,
    loaderData.chat.state
  );

  useResearchSubscription(
    chatState === "generating-research"
      ? { id: loaderData.chat.id }
      : skipToken,
    {
      onData(data) {
        console.log(data);
      },
      onComplete() {
        console.log("completed");
      },
    }
  );

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
