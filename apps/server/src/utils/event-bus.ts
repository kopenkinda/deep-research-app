import { EventEmitter } from "node:events";

type EventBusEvents = {
  readonly "chat:created": [
    {
      readonly chatId: number;
    }
  ];
  readonly "chat:in-progress": [
    {
      readonly chatId: number;
    }
  ];
};

export const eventBus = new EventEmitter<EventBusEvents>({
  captureRejections: true,
});
