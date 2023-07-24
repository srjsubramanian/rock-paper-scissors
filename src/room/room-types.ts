import { Observable } from "rxjs";
import { GamePlayer, IGame, IGameService } from "../game";

export enum RoomState {
  RoomIdle = "room_idle",
  CheckingToStartGame = "checking_to_start_game",
  GameInProgress = "game_in_progress",
}

export enum RoomEvent {
  PlayerJoined = "player_joined",
  GameEnded = "game_ended",
  InsignificantEvent = "insignificant_event",
}

export type PlayerJoinedEvent = {
  type: RoomEvent.PlayerJoined;
  player: string;
};

export type GameEndedEvent = {
  type: RoomEvent.GameEnded;
  winner?: GamePlayer;
};

export type InsignificantEvent = {
  type: RoomEvent.InsignificantEvent;
};

export type RoomEventObject =
  | PlayerJoinedEvent
  | GameEndedEvent
  | InsignificantEvent;

export type Queue = string[];

export type PlayerMap = {
  [player in GamePlayer]?: string;
};

export type GameLog = {
  players: PlayerMap;
  winner?: string;
};

export type GameBoard = GameLog[];

export type RoomContext = {
  queue: Queue;
  board: GameBoard;
  players?: PlayerMap;
  game?: IGame;
  games: IGameService;
};

export interface IRoom {
  state: RoomState;
  state$: Observable<RoomState>;
  board: GameBoard;
  board$: Observable<GameBoard>;
  game?: IGame;
  game$: Observable<IGame | undefined>;
  queue: Queue;
  queue$: Observable<Queue>;
  initialize(): IRoom;
  addPlayer(player: string): IRoom;
}

export interface IRoomService {
  create(name: string): IRoom;
  readonly all: RoomPreview[];
  get(name: string): IRoom | undefined;
}

export type Rooms = Map<string, IRoom>;

export interface RoomPreview {
  name: string;
  length: number;
  hasActiveGame: boolean;
  totalGames: number;
}
