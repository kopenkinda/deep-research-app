import { eq } from "drizzle-orm";
import db from "..";
import { researchTable } from "../schema";

export async function updateChat(
  chatId: number,
  data: Partial<typeof researchTable.$inferInsert>
) {
  return await db
    .update(researchTable)
    .set(data)
    .where(eq(researchTable.id, chatId));
}
