import { createMachine } from "xstate";
import {
  GameContext,
  GameEvent,
  GameEventObject,
  GameState,
} from "./game-types";
import {
  canEndGameOnPlayerInputRegisteredEvent,
  isTie,
  shouldEndGame,
} from "./game-guards";
import {
  assignWinner,
  capturePlayerInput,
  endGameGracefully,
  resetGameOnTie,
  setShouldEndGame,
} from "./game-actions";
import { GAME_DEFAULT_CONTEXT, GAME_DEFAULT_STATE } from "./game-constants";

const gameMachine = createMachine<
  GameContext,
  GameEventObject,
  { value: GameState; context: GameContext }
>(
  {
    id: "rock-paper-scissors-game-machine",
    context: GAME_DEFAULT_CONTEXT,
    initial: GAME_DEFAULT_STATE,
    predictableActionArguments: true,
    states: {
      [GameState.WaitingForPlayerTwo]: {
        on: {
          [GameEvent.PlayerTwoJoined]: GameState.Playing,
        },
      },
      [GameState.Playing]: {
        on: {
          [GameEvent.PlayerInputRegistered]: {
            target: GameState.CheckingForGameCompletion,
            actions: ["capturePlayerInput"],
          },
          [GameEvent.EndGameGracefully]: {
            target: GameState.CheckingForGameCompletion,
            actions: ["setShouldEndGame"],
          },
        },
      },
      [GameState.CheckingForGameCompletion]: {
        always: [
          {
            target: GameState.Ended,
            cond: canEndGameOnPlayerInputRegisteredEvent,
            actions: ["assignWinner"],
          },
          {
            target: GameState.Ended,
            cond: shouldEndGame,
            actions: ["assignWinner"],
          },
          {
            target: GameState.Playing,
            cond: isTie,
            actions: ["resetGameOnTie"],
          },
          {
            target: GameState.Playing,
          },
        ],
      },
      [GameState.Ended]: {
        type: "final",
      },
    },
  },
  {
    actions: {
      capturePlayerInput,
      resetGameOnTie,
      endGameGracefully,
      setShouldEndGame,
      assignWinner,
    },
  }
);

export { gameMachine };
