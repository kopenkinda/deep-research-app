import db from "..";

export function getFollowups(chatId: number) {
  return db.query.followUpsTable.findMany({
    where({ researchId }, { eq }) {
      return eq(researchId, chatId);
    },
  });
}
