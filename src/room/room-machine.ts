import { createMachine } from "xstate";
import {
  isQueueEmpty,
  shouldAddToCurrentGame,
  shouldStartGame,
} from "./room-guards";
import {
  RoomContext,
  RoomState,
  RoomEvent,
  RoomEventObject,
} from "./room-types";
import {
  addPlayerToQueue,
  addToCurrentGame,
  logGameResultAndCleanup,
  startGame,
} from "./room-actions";
import { ROOM_DEFAULT_CONTEXT } from "./room-constants";
import { listenToGameEndEvent } from "./room-listeners";
import { IGameService } from "../game";
const createRoomMachine = (games: IGameService) =>
  createMachine<
    RoomContext,
    RoomEventObject,
    { value: RoomState; context: RoomContext }
  >(
    {
      id: "game-room-machine",
      context: { ...ROOM_DEFAULT_CONTEXT, games },
      predictableActionArguments: true,
      initial: RoomState.RoomIdle,
      states: {
        [RoomState.RoomIdle]: {
          on: {
            [RoomEvent.PlayerJoined]: {
              target: RoomState.CheckingToStartGame,
              actions: ["addPlayerToQueue"],
            },
          },
        },
        [RoomState.CheckingToStartGame]: {
          always: [
            {
              target: RoomState.GameInProgress,
              cond: shouldStartGame,
              actions: ["startGame"],
            },
            {
              target: RoomState.GameInProgress,
              cond: shouldAddToCurrentGame,
              actions: ["addToCurrentGame"],
            },
            { target: RoomState.GameInProgress },
          ],
        },
        [RoomState.GameInProgress]: {
          on: {
            [RoomEvent.GameEnded]: [
              {
                target: RoomState.RoomIdle,
                actions: ["logGameResultAndCleanup"],
                cond: isQueueEmpty,
              },
              {
                target: RoomState.CheckingToStartGame,
                actions: ["logGameResultAndCleanup"],
              },
            ],
            [RoomEvent.PlayerJoined]: {
              target: RoomState.CheckingToStartGame,
              actions: ["addPlayerToQueue"],
            },
          },
          invoke: {
            src: listenToGameEndEvent,
          },
        },
      },
    },
    {
      actions: {
        addPlayerToQueue,
        startGame,
        addToCurrentGame,
        logGameResultAndCleanup,
      },
    }
  );

export { createRoomMachine };
