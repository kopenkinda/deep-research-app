import { TRPCError } from "@trpc/server";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../utils/trpc";

export const chatRouter = router({
  initialize: publicProcedure
    .input(
      z.object({
        topic: z.string().nonempty().endsWith("?"),
        breadth: z.number().int().positive().min(1).max(10).optional(),
        width: z.number().int().positive().min(1).max(10).optional(),
      })
    )
    .mutation(async ({ ctx: { db, schemas }, input }) => {
      const result = await db
        .insert(schemas.researchTable)
        .values({
          topic: input.topic,
          breadth: input.breadth,
          width: input.width,
        })
        .returning();
      const entry = result.at(0);
      if (!entry) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create chat. Try again later.",
        });
      }
      return entry;
    }),
  getAllChatMetas: publicProcedure.query(async ({ ctx: { db, schemas } }) => {
    const entries = await db
      .select({
        id: schemas.researchTable.id,
        topic: schemas.researchTable.topic,
      })
      .from(schemas.researchTable)
      .orderBy(desc(schemas.researchTable.id));
    return entries;
  }),
});
