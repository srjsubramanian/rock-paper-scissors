import { nanoid } from "nanoid";
import { BroadcastChannel } from "broadcast-channel";

type EventHandler = (event: MessageEvent) => void;

class EventListener {
  private readonly handlers = new Map<
    string,
    Array<{
      id: string;
      handler: EventHandler;
    }>
  >();
  private readonly eventsToListenTo = new Set<string>();
  private readonly channel: BroadcastChannel;

  constructor(channelName: string) {
    this.channel = new BroadcastChannel(channelName);
    this.channel.onmessage = this.callHandlersOnMessage.bind(this);
  }

  private callHandlersOnMessage(message: MessageEvent) {
    const eventType = message.type;
    if (this.eventsToListenTo.has(eventType)) {
      const existingHandlers = (this.handlers.get(eventType) ?? []).map(
        ({ handler }) => handler
      );
      existingHandlers.forEach((handler) => handler(message));
    }
  }

  on(eventType: string, handler: EventHandler): string {
    const id = nanoid();
    const existingHandlers = this.handlers.get(id) ?? [];
    this.handlers.set(eventType, [...existingHandlers, { id, handler }]);
    if (!this.eventsToListenTo.has(eventType)) {
      this.eventsToListenTo.add(eventType);
    }
    return id;
  }
  off(eventType: string, listenerId: string): void {
    if (this.handlers.has(eventType)) {
      const existingHandlers = this.handlers.get(eventType) ?? [];
      const newHandlers = existingHandlers.filter(
        ({ id }) => id !== listenerId
      );
      this.handlers.set(eventType, newHandlers);
      if (newHandlers.length < 1) {
        this.eventsToListenTo.delete(eventType);
      }
    }
  }
}

export { EventListener };
