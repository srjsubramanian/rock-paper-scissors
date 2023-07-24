import { assign } from "xstate";
import { GameContext, GameEventObject, GameEvent } from "./game-types";
import { GAME_DEFAULT_CONTEXT } from "./game-constants";
import { findWinner } from "./game-rules";

export const capturePlayerInput = assign<GameContext, GameEventObject>(
  (context: GameContext, event: GameEventObject) => {
    if (event.type === GameEvent.PlayerInputRegistered) {
      return {
        ...context,
        inputs: {
          ...context.inputs,
          ...event.inputs,
        },
      };
    }
    return { ...context };
  }
);
export const resetGameOnTie = assign<GameContext, GameEventObject>({
  ...GAME_DEFAULT_CONTEXT,
  lastRoundTie: true,
});
export const endGameGracefully = assign<GameContext, GameEventObject>({
  ...GAME_DEFAULT_CONTEXT,
  lastGameEndedExternally: true,
});
export const assignWinner = assign<GameContext, GameEventObject>((context) => {
  return {
    ...GAME_DEFAULT_CONTEXT,
    winner: findWinner(context.inputs),
    lastGameEndedExternally: context?.shouldEndGame,
    shouldEndGame: false,
  };
});
export const setShouldEndGame = assign<GameContext, GameEventObject>(
  (context) => ({ ...context, shouldEndGame: true })
);
