import db from "..";
import { researchDocumentTable } from "../schema";

export async function createResearchDocument(
  chatId: number,
  value: Omit<typeof researchDocumentTable.$inferInsert, "researchId">
) {
  return await db
    .insert(researchDocumentTable)
    .values({ ...value, researchId: chatId })
    .returning({ id: researchDocumentTable.id });
}
