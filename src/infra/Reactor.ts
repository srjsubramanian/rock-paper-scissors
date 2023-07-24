import { Helpers } from "../common";
import { IEventPublisher, IEventListener } from "./infra-types";

abstract class Reactor {
  constructor(
    protected readonly taskResultsPublisher: IEventPublisher,
    protected readonly tasksListener: IEventListener
  ) {
    this.supportedCommands().forEach((command) => {
      this.tasksListener.on(command, async (message) => {
        const { id } = message.data;
        try {
          const result = await this.run(command, message.data);
          await this.taskResultsPublisher.publish({
            type: Helpers.commandResultType(command),
            data: {
              id,
              ...result,
            },
          });
        } catch (error) {
          await this.taskResultsPublisher.publish({
            type: Helpers.commandErrorType(command),
            data: {
              id,
            },
          });
        }
      });
    });
  }
  abstract supportedCommands(): string[];
  abstract run(task: string, data: any): Promise<any>;
}

export { Reactor };
