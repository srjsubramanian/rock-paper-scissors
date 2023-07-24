import { GameContext, GameState } from "./game-types";

export const GAME_DEFAULT_CONTEXT: GameContext = {
  shouldEndGame: false,
  lastGameEndedExternally: false,
  lastRoundTie: false,
  inputs: {},
};

export const GAME_DEFAULT_STATE = GameState.WaitingForPlayerTwo;
