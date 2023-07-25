import { Helpers } from "../common";
import { IEventPublisher, IEventListener } from "./infra-types";

abstract class Reactor {
  constructor(
    protected readonly tasksPublisher: IEventPublisher,
    protected readonly tasksListener: IEventListener
  ) {
    this.supportedTasks().forEach((command) => {
      this.tasksListener.on(command, async (message) => {
        const { id } = message.data;
        try {
          const result = await this.run(command, message.data);
          await this.tasksPublisher.publish({
            type: Helpers.taskResultType(command),
            data: {
              id,
              ...result,
            },
          });
        } catch (error) {
          await this.tasksPublisher.publish({
            type: Helpers.taskErrorType(command),
            data: {
              id,
            },
          });
        }
      });
    });
  }
  abstract supportedTasks(): string[];
  abstract run(task: string, data: any): Promise<any>;
}

export { Reactor };
