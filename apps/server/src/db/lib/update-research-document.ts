import { eq } from "drizzle-orm";
import db from "..";
import { researchDocumentTable } from "../schema";

export async function updateResearchDocument(
  documentId: number,
  fields: Partial<typeof researchDocumentTable.$inferSelect>
) {
  return await db
    .update(researchDocumentTable)
    .set({ ...fields })
    .where(eq(researchDocumentTable.id, documentId));
}
