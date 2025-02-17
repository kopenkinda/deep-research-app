import { z } from "zod";
import { publicProcedure, router } from "../utils/trpc";

export const researchDocumentRouter = router({
  getRelated: publicProcedure
    .input(
      z.object({
        id: z.number().int(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.researchDocumentTable.findMany({
        where: ({ researchId }, { eq }) => eq(researchId, input.id),
      });
    }),
});
