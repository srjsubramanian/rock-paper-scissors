import { GameState } from "../game";
import { RoomContext } from "./room-types";

export const shouldStartGame = (context: RoomContext) => {
  if (context.queue.length > 0 && !context.game) {
    return true;
  }
  return false;
};

export const shouldAddToCurrentGame = (context: RoomContext) => {
  if (
    context.queue.length > 0 &&
    context.game &&
    context.game.state === GameState.WaitingForPlayerTwo
  ) {
    return true;
  }
  return false;
};

export const isQueueEmpty = (context: RoomContext) =>
  !(context.queue.length > 0);
