import { nanoid } from "nanoid";
import { Constants, Helpers } from "../common";
import {
  IEventListener,
  IEventPublisher,
  IForegroundWorker,
} from "./infra-types";
class ForegroundWorker implements IForegroundWorker {
  constructor(
    private readonly tasksPublisher: IEventPublisher,
    private readonly taskResultsListener: IEventListener,
    private readonly stateEventsListener: IEventListener
  ) {
    this.stateEventsListener.on(Constants.PLAYER_STATE_CHANGED, console.log);
    this.stateEventsListener.on(Constants.ROOM_STATE_CHANGED, console.log);
    this.stateEventsListener.on(Constants.GAME_STATE_CHANGED, console.log);
  }
  async run<ResultType = any, PayloadType = any>(
    taskType: string,
    payload: PayloadType
  ): Promise<ResultType> {
    const id = nanoid();
    const execution = new Promise<ResultType>(async (resolve, reject) => {
      try {
        this.taskResultsListener.on(
          Helpers.taskResultType(taskType),
          (event) => {
            if (event.data?.id === id) {
              resolve(event.data as ResultType);
            }
          }
        );
        this.taskResultsListener.on(
          Helpers.taskErrorType(taskType),
          (event) => {
            if (event.data?.id === id) {
              reject(event.data);
            }
          }
        );
        await this.tasksPublisher.publish({
          type: taskType,
          data: { ...payload, id },
        });
      } catch (error) {
        reject(error);
      }
    });
    const result = (await execution) as ResultType;
    return result;
  }
}

export { ForegroundWorker };
