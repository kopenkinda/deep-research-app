import { eq } from "drizzle-orm";
import db from "..";
import { schemas } from "../schema";

export async function deleteChat(chatId: number) {
  try {
    await db
      .delete(schemas.followUpsTable)
      .where(eq(schemas.followUpsTable.researchId, chatId));
    await db
      .delete(schemas.researchTable)
      .where(eq(schemas.researchTable.id, chatId));
    return true;
  } catch (error) {
    console.error("Error deleting chat:", error);
    return false;
  }
}
