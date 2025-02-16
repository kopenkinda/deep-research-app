import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const researchTable = sqliteTable("research_table", {
  id: int().primaryKey({ autoIncrement: true }),
  topic: text().notNull(),
  breadth: int().notNull().default(4),
  depth: int().notNull().default(2),
  state: text({
    enum: [
      "generating-followups",
      "follow-up-required",
      "awaiting-research",
      "generating-research",
      "finished",
    ],
  })
    .notNull()
    .default("generating-followups"),
  createdAt: int({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

export const researchToFollowUpsRelation = relations(
  researchTable,
  ({ many }) => ({
    followUps: many(followUpsTable),
  })
);

export const followUpsTable = sqliteTable("follow_ups_table", {
  id: int().primaryKey({ autoIncrement: true }),
  question: text().notNull(),
  answer: text(),
  placeholder: text().notNull(),
  researchId: int("research_id").notNull(),
  createdAt: int({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

export const followUpToResearchRelation = relations(
  followUpsTable,
  ({ one }) => ({
    research: one(researchTable, {
      fields: [followUpsTable.researchId],
      references: [researchTable.id],
    }),
  })
);

export const researchDocumentTable = sqliteTable("research_document", {
  id: int().primaryKey({ autoIncrement: true }),
  researchId: int("research_id").notNull(),
  serp: text().notNull(),
  document: text().notNull(),
  depth: int().notNull(),
  breadth: int().notNull(),
  createdAt: int({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`),
});

export const researchDocumentToResearchRelation = relations(
  researchDocumentTable,
  ({ one }) => ({
    research: one(researchTable, {
      fields: [researchDocumentTable.researchId],
      references: [researchTable.id],
    }),
  })
);

export const researchToResearchDocumentRelation = relations(
  researchTable,
  ({ many }) => ({
    documents: many(researchDocumentTable),
  })
);

export const schemas = {
  researchTable,
  followUpsTable,
  researchDocumentTable,
  followUpToResearchRelation,
  researchToFollowUpsRelation,
  researchDocumentToResearchRelation,
  researchToResearchDocumentRelation,
};
