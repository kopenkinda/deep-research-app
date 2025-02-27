import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { deleteChat } from "../db/lib/delete-chat";
import { getChat } from "../db/lib/get-chat";
import { getFollowups } from "../db/lib/get-followups";
import { updateChat } from "../db/lib/update-chat";
import { chatEventBus, emit } from "../events/chat-event-bus";
import { publicProcedure, router } from "../utils/trpc";

export const chatRouter = router({
  initialize: publicProcedure
    .input(
      z.object({
        topic: z.string().nonempty(),
        breadth: z.number().int().positive().min(1).max(10).optional(),
        depth: z.number().int().positive().min(1).max(10).optional(),
      })
    )
    .mutation(async ({ ctx: { db, schemas }, input }) => {
      const result = await db
        .insert(schemas.researchTable)
        .values({
          topic: input.topic,
          breadth: input.breadth,
          depth: input.depth,
        })
        .returning();
      const entry = result.at(0);
      if (!entry) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create chat. Try again later.",
        });
      }
      const willBeHandled = chatEventBus.emit("chat:created", {
        chatId: entry.id,
      });
      if (!willBeHandled) {
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
  getChat: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const chat = getChat(input.id);
      return chat;
    }),
  getFollowups: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const followups = getFollowups(input.id);
      return followups;
    }),
  setFollowupAnswer: publicProcedure
    .input(
      z.object({
        id: z.number().int(),
        answer: z.string().nonempty(),
        chatId: z.number().int(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { db, schemas } = ctx;
      await db
        .update(schemas.followUpsTable)
        .set({ answer: input.answer })
        .where(eq(schemas.followUpsTable.id, input.id));
      const followups = await getFollowups(input.id);
      const allAnswered = followups.every((f) => f.answer !== null);
      if (allAnswered) {
        await updateChat(input.chatId, { state: "awaiting-research" });
      }
    }),
  deleteChat: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      return await deleteChat(input.id);
    }),
  startResearch: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      const chat = await getChat(input.id);
      if (!chat) {
        return;
      }
      if (chat.state !== "awaiting-research") {
        return;
      }
      await updateChat(chat.id, { state: "generating-research" });
      emit("chat:start-research", {
        chatId: input.id,
      });
    }),
});
