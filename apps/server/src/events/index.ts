import { generateFeedback } from "../ai/generate-followups";
import { createFollowups } from "../db/lib/create-followups";
import { getChat } from "../db/lib/get-chat";
import { updateChat } from "../db/lib/update-chat";
import { eventBus } from "../utils/event-bus";

export function subscribe() {
  eventBus.on("chat:created", async (data) => {
    const chat = await getChat(data.chatId);
    console.log("chat:created", chat);
    if (!chat) {
      return;
    }
    const feedback = await generateFeedback({ query: chat.topic });
    if (feedback.length === 0) {
      await updateChat(chat.id, { state: "in-progress" });
      return eventBus.emit("chat:in-progress", { chatId: chat.id });
    }
    const count = await createFollowups(chat.id, feedback);
    if (count === 0) {
      await updateChat(chat.id, { state: "in-progress" });
      return eventBus.emit("chat:in-progress", { chatId: chat.id });
    }
    await updateChat(chat.id, { state: "follow-up-required" });
  });
}
