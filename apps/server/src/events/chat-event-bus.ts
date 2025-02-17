import { EventEmitter } from "node:events";

export type ChatRelatedEventBase = { readonly chatId: number };

export type ExplicitChatUpdates = {
  event: Omit<keyof ChatEventBusEvents, "chat:updated">;
};

export type ChatEventBusEvents = {
  readonly "chat:created": [ChatRelatedEventBase];
  readonly "chat:start-research": [ChatRelatedEventBase];
  readonly "chat:in-progress": [ChatRelatedEventBase];
  readonly "chat:updated": [ChatRelatedEventBase & ExplicitChatUpdates];
  readonly "chat:research-finished": [ChatRelatedEventBase];
};

export const chatEventBus = new EventEmitter<ChatEventBusEvents>({
  captureRejections: true,
});

export const emit = <TEventName extends keyof ChatEventBusEvents>(
  event: TEventName,
  ...args: TEventName extends keyof ChatEventBusEvents
    ? ChatEventBusEvents[TEventName]
    : never
) => {
  if (event !== "chat:updated") {
    chatEventBus.emit("chat:updated", { chatId: args[0].chatId, event });
  }
  chatEventBus.emit(event, ...args);
};
