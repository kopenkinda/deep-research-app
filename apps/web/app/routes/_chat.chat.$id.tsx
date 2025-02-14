import { redirect } from "react-router";
import { ProgressVisualiser } from "~/components/chat/visualiser";
import { client } from "~/trpc/client";
import type { Route } from "./+types/_chat.chat.$id";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const chatId = +params.id;
  if (Number.isNaN(chatId)) {
    return redirect("/chat");
  }
  try {
    const parsed = await client.chat.getChat.query({ id: chatId });
    return { chat: parsed };
  } catch (e) {
    return redirect("/chat");
  }
};

export default function ChatPage({ loaderData }: Route.ComponentProps) {
  const chat = loaderData.chat;
  return (
    <>
      <ProgressVisualiser />
      <pre>{JSON.stringify(chat, null, 2)}</pre>
    </>
  );
}
