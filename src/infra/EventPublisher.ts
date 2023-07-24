import { BroadcastChannel } from "broadcast-channel";

type Message = {
  type: string;
  data: any;
};

class EventPublisher {
  private readonly channel: BroadcastChannel;
  constructor(channelName: string) {
    this.channel = new BroadcastChannel(channelName);
  }
  async publish(message: Message) {
    await this.channel.postMessage(message);
  }
}

export { EventPublisher };
