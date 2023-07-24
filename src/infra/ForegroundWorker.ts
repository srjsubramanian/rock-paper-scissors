import { nanoid } from "nanoid";
import { Helpers, Constants } from "../common";
import { IEventListener, IEventPublisher } from "./infra-types";

class ForegroundWorker {
  constructor(
    private readonly uiCommandsPublisher: IEventPublisher,
    private readonly uiCommandResultsListener: IEventListener
  ) {}
  private async commandRunner<ResultType = any, PayloadType = any>(
    commandType: string,
    payload: PayloadType
  ) {
    const id = nanoid();
    const commandTask = new Promise(async (resolve, reject) => {
      try {
        this.uiCommandResultsListener.on(
          Helpers.commandResultType(commandType),
          (event) => {
            if (event.data?.id === id) {
              resolve(event.data);
            }
          }
        );
        this.uiCommandResultsListener.on(
          Helpers.commandErrorType(commandType),
          (event) => {
            if (event.data?.id === id) {
              reject(event.data);
            }
          }
        );
        await this.uiCommandsPublisher.publish({
          type: commandType,
          data: { ...payload, id },
        });
      } catch (error) {
        reject(error);
      }
    });
    const result = (await commandTask) as ResultType;
    return result;
  }
  async createPlayerWithName(name: string) {
    console.log({ name });
    const result = await this.commandRunner<{ playerId: string }>(
      Constants.CREATE_PLAYER,
      { name }
    );
    return result;
  }
}

export { ForegroundWorker };
