import { EventListener } from "./EventListener";
import { EventPublisher } from "./EventPublisher";

const TASKS_CHANNEL = "tasks";
export const tasksListener = new EventListener(TASKS_CHANNEL);
export const tasksPublisher = new EventPublisher(TASKS_CHANNEL);

const STATE_EVENTS_CHANNEL = "state-events";
export const stateEventsListener = new EventListener(STATE_EVENTS_CHANNEL);
export const stateEventsPublisher = new EventPublisher(STATE_EVENTS_CHANNEL);
