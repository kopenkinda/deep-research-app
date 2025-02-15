import db from "..";

export async function getChat(chatId: number) {
  return await db.query.researchTable.findFirst({
    where: ({ id }, { eq }) => eq(id, chatId),
  });
}
