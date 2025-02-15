import db from "..";
import { followUpsTable } from "../schema";
import { getChat } from "./get-chat";

export async function createFollowups(chatId: number, feedback: string[]) {
  const chat = await getChat(chatId);
  if (!chat) {
    return 0;
  }
  await db.insert(followUpsTable).values(
    feedback.map((text) => ({
      question: text,
      researchId: chatId,
    }))
  );
  return feedback.length;
}
