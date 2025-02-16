import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const researchTable = sqliteTable("research_table", {
  id: int().primaryKey({ autoIncrement: true }),
  topic: text().notNull(),
  breadth: int().notNull().default(4),
  width: int().notNull().default(2),
  state: text({
    enum: [
      "setup",
      "generating-followups",
      "follow-up-required",
      "generating-research",
      "finished",
    ],
  })
    .notNull()
    .default("setup"),
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

export const schemas = {
  researchTable,
  followUpsTable,
  followUpToResearchRelation,
  researchToFollowUpsRelation,
};
