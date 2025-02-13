import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const researchTable = sqliteTable("research_table", {
  id: int().primaryKey({ autoIncrement: true }),
  topic: text().notNull(),
  breadth: int().notNull().default(4),
  width: int().notNull().default(2),
});

export const schemas = {
  researchTable,
};
