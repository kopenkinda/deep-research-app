import { generateFeedback } from "../ai/generate-followups";
import { deepResearch } from "../ai/new-deep-research";
import { createFollowups } from "../db/lib/create-followups";
import { createResearchDocument } from "../db/lib/create-research-document";
import { getChat } from "../db/lib/get-chat";
import { getFollowups } from "../db/lib/get-followups";
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
    const followUps = await getFollowups(chat.id);
    await updateChat(chat.id, { state: "generating-research" });
    const ids: Record<string, number> = {};
    for await (const res of deepResearch({
      breadth: chat.breadth,
      depth: chat.depth,
      followUps,
      query: chat.topic,
    })) {
      console.log("DeepResearch", res);
      switch (res.type) {
        case "document:query": {
          const [document] = await createResearchDocument(chat.id, {
            breadth: res.breadth,
            depth: res.depth,
            goal: res.goal,
            serp: res.query,
          });
          ids[res.id] = document.id;
          break;
        }
        case "document:visit": {
          await updateResearchDocument(ids[res.id], {
            status: "success",
            document: res.result,
            url: res.url,
          });
          break;
        }
        case "document:visit-failed": {
          await updateResearchDocument(ids[res.id], {
            status: "error",
          });
          break;
        }
      }
    }
    await updateChat(chat.id, { state: "finished" });
  });
}
