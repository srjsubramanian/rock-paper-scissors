import { createMachine } from "xstate";
import {
  PlayerContext,
  PlayerEventObject,
  PlayerEvent,
  PlayerState,
} from "./player-types";
import { PLAYER_DEFAULT_CONTEXT } from "./player-constants";
import {
  clearPlayerRoom,
  savePlayerName,
  savePlayerRoom,
} from "./player-actions";

const playerMachine = createMachine<
  PlayerContext,
  PlayerEventObject,
  {
    value: PlayerState;
    context: PlayerContext;
  }
>(
  {
    id: "player-state-machine",
    initial: PlayerState.WaitingForName,
    predictableActionArguments: true,
    context: PLAYER_DEFAULT_CONTEXT,
    states: {
      [PlayerState.WaitingForName]: {
        on: {
          [PlayerEvent.NameInput]: {
            target: PlayerState.WaitingToChooseRoom,
            actions: ["savePlayerName"],
          },
        },
      },
      [PlayerState.WaitingToChooseRoom]: {
        on: {
          [PlayerEvent.RoomChosen]: {
            target: PlayerState.PlayerInRoom,
            actions: ["savePlayerRoom"],
          },
        },
      },
      [PlayerState.PlayerInRoom]: {
        on: {
          [PlayerEvent.ExitFromRoom]: {
            target: PlayerState.WaitingToChooseRoom,
            actions: ["clearPlayerRoom"],
          },
        },
      },
    },
  },
  {
    actions: {
      savePlayerName,
      savePlayerRoom,
      clearPlayerRoom,
    },
  }
);

export { playerMachine };
