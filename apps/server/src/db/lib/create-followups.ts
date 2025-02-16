import db from "..";
import type { FollowUpQuestionGenerationResult } from "../../ai/generate-followups";
import { followUpsTable } from "../schema";
import { getChat } from "./get-chat";

export async function createFollowups(
  chatId: number,
  feedback: FollowUpQuestionGenerationResult
) {
  const chat = await getChat(chatId);
  if (!chat) {
    return 0;
  }
  const follupValuesToInsert = feedback.map(({ question, placeholder }) => ({
    question,
    researchId: chatId,
    placeholder,
  }));
  await db.insert(followUpsTable).values(follupValuesToInsert);
  return feedback.length;
}
