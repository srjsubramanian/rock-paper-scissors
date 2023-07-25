export type EventHandler = (event: MessageEvent) => void;

export interface IEventListener {
  on(eventType: string, handler: EventHandler): string;
  off(eventType: string, listenerId: string): void;
}

export type Message = {
  type: string;
  data: {
    id: string;
    [x: string]: any;
  };
};

export interface IEventPublisher {
  publish(message: Message): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
declare var IEventPublisher: {
  new (channelName: string): IEventPublisher;
};

export interface IForegroundWorker {
  run<ResultType = any, PayloadType = any>(
    taskType: string,
    payload: PayloadType
  ): Promise<ResultType>;
}
