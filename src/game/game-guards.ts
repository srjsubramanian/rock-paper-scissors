import { findWinner } from "./game-rules";
import { GameContext } from "./game-types";

export const haveBothPlayersInput = (context: GameContext) => {
  if (context.inputs?.player_1 && context.inputs.player_2) {
    return true;
  }
  return false;
};

export const hasWinner = (context: GameContext) =>
  haveBothPlayersInput(context) && !!findWinner(context.inputs);

export const canEndGameOnPlayerInputRegisteredEvent = (context: GameContext) =>
  haveBothPlayersInput(context) && hasWinner(context);

export const isTie = (context: GameContext) =>
  haveBothPlayersInput(context) && !hasWinner(context);

export const shouldEndGame = (context: GameContext) =>
  Boolean(context.shouldEndGame);
