import { Observable } from "rxjs";

export enum Input {
  Rock = "rock",
  Paper = "paper",
  Scissors = "scissors",
}

export enum Player {
  Player1 = "player_1",
  Player2 = "player_2",
}

export type PlayerInputs = {
  [player in Player]: Input;
};

export enum GameEvent {
  PlayerTwoJoined = "player_two_joined",
  PlayerInputRegistered = "player_input_registered",
  EndGameGracefully = "end_game_gracefully",
}

export type PlayerTwoJoinedEvent = {
  type: GameEvent.PlayerTwoJoined;
};

export type PlayerInputRegisteredEvent = {
  type: GameEvent.PlayerInputRegistered;
  inputs: Partial<PlayerInputs>;
};

export type EndGameGracefullyEvent = {
  type: GameEvent.EndGameGracefully;
};

export enum GameState {
  WaitingForPlayerTwo = "waiting_for_player_two",
  Playing = "playing",
  CheckingForGameCompletion = "checking_for_game_completion",
  Ended = "ended",
}

export type GameContext = {
  inputs?: Partial<PlayerInputs>;
  lastRoundTie?: boolean;
  lastGameEndedExternally?: boolean;
  winner?: Player;
  shouldEndGame?: boolean;
};

export type GameEventObject =
  | PlayerTwoJoinedEvent
  | PlayerInputRegisteredEvent
  | EndGameGracefullyEvent;

export interface IGame {
  state$: Observable<GameState>;
  state: GameState;
  players: {
    [player in Player]?: string;
  };
  winner?: Player;
  initialize(player1: string): IGame;
  addPlayer(player2: string): IGame;
  registerPlayerInput(player: Player, input: Input): IGame;
  getPlayerInput(player: Player): Input | undefined;
  end(): void;
}

export interface IGameService {
  create(): IGame;
}
