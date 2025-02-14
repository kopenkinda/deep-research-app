import { ProgressVisualiser } from "~/components/chat/visualiser";
import type { Route } from "./+types/_chat.chat.$id";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const chatId = params.id;
  return { id: chatId };
};

export default function ChatPage({ loaderData }: Route.ComponentProps) {
  const id = loaderData.id;
  return (
    <>
      <ProgressVisualiser />
    </>
  );
}
