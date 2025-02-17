import { redirect } from "react-router";
import { ChatFollowupQuestions } from "~/components/chat/followup-questions";
import { ResearchDocuments } from "~/components/chat/research-documents";
import { useChatState } from "~/hooks/use-chat-state";
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
  return (
    <>
      {(chatState === "follow-up-required" ||
        chatState === "generating-followups" ||
        chatState === "awaiting-research") && (
        <ChatFollowupQuestions
          chatId={loaderData.chat.id}
          isLoading={chatState === "generating-followups"}
          isReadyToStart={chatState === "awaiting-research"}
          refetchState={async () => {
            await refetchState();
          }}
        />
      )}
      <ResearchDocuments chatId={loaderData.chat.id} chatState={chatState} />
    </>
  );
}
