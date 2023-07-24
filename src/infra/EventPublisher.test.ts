import { EventPublisher } from "./EventPublisher";
import { BroadcastChannel } from "broadcast-channel";

describe("EventPublisher", () => {
  const channelName = "test-channel";
  const channel = new BroadcastChannel(channelName);
  test("should post message to specified channel", async () => {
    const publisher = new EventPublisher(channelName);
    const testMessage = {
      type: "test-message",
      data: { key: "val", id: "test-id" },
    };
    const messages: MessageEvent[] = [];
    channel.onmessage = (message) => messages.push(message);
    await publisher.publish(testMessage);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject(testMessage);
  });
});
