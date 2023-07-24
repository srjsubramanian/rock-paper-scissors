import { EventListener } from "./EventListener";
import { EventPublisher } from "./EventPublisher";

const UI_COMMANDS_CHANNEL = "ui-commands";
const UI_COMMAND_RESULTS_CHANNEL = "ui-command-results";

export const uiCommandsPublisher = new EventPublisher(UI_COMMANDS_CHANNEL);
export const tasksListener = new EventListener(UI_COMMANDS_CHANNEL);

export const taskResultsPublisher = new EventPublisher(
  UI_COMMAND_RESULTS_CHANNEL
);
export const uiCommandResultsListener = new EventListener(
  UI_COMMAND_RESULTS_CHANNEL
);
