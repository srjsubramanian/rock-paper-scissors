import { GameContext, GameState } from "./game-types";

export const GAME_DEFAULT_CONTEXT: GameContext = {
  shouldEndGame: false,
  lastGameEndedExternally: false,
  lastRoundTie: false,
  inputs: {},
};

export const GAME_DEFAULT_STATE = GameState.WaitingForPlayerTwo;
export const GAME_STATE_CHANGED = "GAME_STATE_CHANGED";
export const GET_ALL_GAMES = "GET_ALL_GAMES";
export const GET_GAME = "GET_GAME";
