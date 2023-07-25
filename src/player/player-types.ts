import { Observable } from "rxjs";

export enum PlayerState {
  WaitingForName = "waiting_for_name",
  WaitingToChooseRoom = "waiting_to_choose_room",
  PlayerInRoom = "player_in_room",
}

export enum PlayerEvent {
  NameInput = "name_input",
  RoomChosen = "room_chosen",
  ExitFromRoom = "exit_from_room",
}

export type NameInputEvent = {
  type: PlayerEvent.NameInput;
  name: string;
};

export type RoomChosenEvent = {
  type: PlayerEvent.RoomChosen;
  room: string;
};

export type ExitFromRoomEvent = {
  type: PlayerEvent.ExitFromRoom;
};

export type PlayerEventObject =
  | NameInputEvent
  | RoomChosenEvent
  | ExitFromRoomEvent;

export type PlayerContext = {
  name?: string;
  room?: string;
};

export interface IPlayer {
  readonly id: string;
  readonly state: PlayerState;
  readonly state$: Observable<PlayerState>;
  readonly name: string;
  readonly name$: Observable<string>;
  readonly room?: string;
  readonly room$: Observable<string | undefined>;
  initialize(): IPlayer;
  setName(name: string): IPlayer;
  setRoom(room: string): IPlayer;
  exitRoom(): IPlayer;
}

export interface IPlayerService {
  create(): IPlayer;
  readonly all: IPlayer[];
  get(id: string): IPlayer | undefined;
}
