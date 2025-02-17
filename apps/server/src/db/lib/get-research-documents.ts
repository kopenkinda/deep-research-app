import db from "..";

export async function getResearchDocuments(chatId: number) {
  return await db.query.researchDocumentTable.findMany({
    where({ researchId }, { eq }) {
      return eq(researchId, chatId);
    },
  });
}
