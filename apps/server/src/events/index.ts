import { generateFeedback } from "../ai/generate-followups";
import { writeFinalReport } from "../ai/generate-report";
import { deepResearch } from "../ai/new-deep-research";
import { createFollowups } from "../db/lib/create-followups";
import { createResearchDocument } from "../db/lib/create-research-document";
import { getChat } from "../db/lib/get-chat";
import { getFollowups } from "../db/lib/get-followups";
import { getResearchDocuments } from "../db/lib/get-research-documents";
import { updateChat } from "../db/lib/update-chat";
import { updateResearchDocument } from "../db/lib/update-research-document";
import { chatEventBus, emit } from "./chat-event-bus";

export function subscribe() {
  chatEventBus.on("chat:created", async (data) => {
    const chat = await getChat(data.chatId);
    console.log("chat:created", chat);
    if (!chat) {
      return;
    }
    const feedback = await generateFeedback({ query: chat.topic });
    if (feedback.length === 0) {
      await updateChat(chat.id, { state: "awaiting-research" });
      return emit("chat:in-progress", { chatId: chat.id });
    }
    const count = await createFollowups(chat.id, feedback);
    if (count === 0) {
      await updateChat(chat.id, { state: "awaiting-research" });
      return emit("chat:in-progress", { chatId: chat.id });
    }
    await updateChat(chat.id, { state: "follow-up-required" });
  });

  chatEventBus.on("chat:start-research", async (data) => {
    const chat = await getChat(data.chatId);
    if (!chat) {
      return;
    }
    console.log("DeepResearch for chat", chat.id, "started");
    const followUps = await getFollowups(chat.id);
    await updateChat(chat.id, { state: "generating-research" });
    const ids: Record<string, number> = {};
    for await (const res of deepResearch({
      breadth: chat.breadth,
      depth: chat.depth,
      followUps,
      query: chat.topic,
    })) {
      console.log("DeepResearch", res.type);
      switch (res.type) {
        case "document:query": {
          const [document] = await createResearchDocument(chat.id, {
            breadth: res.breadth,
            depth: res.depth,
            goal: res.goal,
            serp: res.query,
          });
          ids[res.tempId] = document.id;
          break;
        }
        case "document:visit": {
          await updateResearchDocument(ids[res.tempId], {
            status: "success",
            document: res.result,
            url: res.url,
          });
          break;
        }
        case "document:visit-failed": {
          await updateResearchDocument(ids[res.tempId], {
            status: "error",
          });
          break;
        }
        case "document:learnt": {
          await updateResearchDocument(ids[res.tempId], {
            status: "success",
            learnings: JSON.stringify(res.learnings),
          });
          break;
        }
      }
    }
    await updateChat(chat.id, { state: "finished" });
    emit("chat:research-finished", { chatId: chat.id });
  });

  chatEventBus.on("chat:research-finished", async (data) => {
    const chat = await getChat(data.chatId)!;
    if (!chat) return;
    const documents = await getResearchDocuments(chat.id);
    const filteredDocs = documents.filter((d) => d.status === "success");
    const report = await writeFinalReport({
      prompt: chat.topic,
      learnings: filteredDocs.flatMap(
        (doc) => JSON.parse(doc.learnings) as string[]
      ),
    });
    await updateChat(chat.id, { analysis: report });
  });
}
