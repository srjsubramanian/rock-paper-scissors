import { BroadcastChannel } from "broadcast-channel";
import { Message, IEventPublisher } from "./infra-types";

class EventPublisher implements IEventPublisher {
  private channel: BroadcastChannel;
  constructor(channelName: string) {
    this.channel = new BroadcastChannel(channelName);
  }
  async publish(message: Message) {
    await this.channel.postMessage(message);
  }
}

export { EventPublisher };
