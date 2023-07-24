import { BroadcastChannel } from "broadcast-channel";
import { EventListener } from "./EventListener";

describe("EventListener", () => {
  const channelName = "test-channel";
  const eventType = "test-event";
  const channel = new BroadcastChannel(channelName);
  test("should register handler", async () => {
    const listener = new EventListener(channelName);
    const handler = jest.fn();
    listener.on(eventType, handler);
    const message = { type: eventType };
    await channel.postMessage({ type: eventType });
    expect(handler).toBeCalled();
    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith(message);
  });
  test("should deregister handler", async () => {
    const listener = new EventListener(channelName);
    const handler = jest.fn();
    const handlerId = listener.on(eventType, handler);
    const message = { type: eventType };
    await channel.postMessage({ type: eventType });
    expect(handler).toBeCalled();
    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith(message);
    listener.off(eventType, handlerId);
    await channel.postMessage({ type: eventType });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
