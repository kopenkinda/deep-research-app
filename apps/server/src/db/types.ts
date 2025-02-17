import type {
  followUpsTable,
  researchDocumentTable,
  researchTable,
} from "./schema";

export type Models = {
  Research: typeof researchTable.$inferSelect;
  FollowUp: typeof followUpsTable.$inferSelect;
  ResearchDocument: typeof researchDocumentTable.$inferSelect;
};
