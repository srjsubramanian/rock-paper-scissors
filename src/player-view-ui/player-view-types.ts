export enum PlayerViewState {
  CheckingIfPlayer = "checking_if_player",
  NamedPlayer = "named_player",
  WaitingForPlayerName = "waiting_for_player_name",
  CreatingPlayer = "creating_player",
  Error = "error",
}

export type CheckingIfPlayerContext = {
  state: PlayerViewState.CheckingIfPlayer;
};
export type NamedPlayerContext = {
  state: PlayerViewState.NamedPlayer;
  name: string;
  playerId: string;
};
export type WaitingForPlayerNameContext = {
  state: PlayerViewState.WaitingForPlayerName;
};
export type CreatingPlayerContext = {
  state: PlayerViewState.CreatingPlayer;
};
export type ErrorContext = {
  state: PlayerViewState.Error;
  error: string;
};

export type PlayerViewContext =
  | CheckingIfPlayerContext
  | NamedPlayerContext
  | WaitingForPlayerNameContext
  | CreatingPlayerContext
  | ErrorContext;

export enum PlayerViewEvent {
  PlayerFoundInStorage = "player_found_in_storage",
  PlayerNotFoundInStorage = "player_not_found_in_storage",
  PlayerNameInput = "player_name_input",
  PlayerCreated = "player_created",
  PlayerCreationFailed = "player_creation_failed",
}

export type PlayerFoundInStorageEventObject = {
  type: PlayerViewEvent.PlayerFoundInStorage;
  playerId: string;
  name: string;
};

export type PlayerNotFoundInStorageEventObject = {
  type: PlayerViewEvent.PlayerNotFoundInStorage;
};

export type PlayerNameInputEventObject = {
  type: PlayerViewEvent.PlayerNameInput;
  name: string;
};

export type PlayerCreatedEventObject = {
  type: PlayerViewEvent.PlayerCreated;
  playerId: string;
  name: string;
};

export type PlayerCreationFailedObject = {
  type: PlayerViewEvent.PlayerCreationFailed;
  error: string;
};

export type PlayerViewEventObject =
  | PlayerFoundInStorageEventObject
  | PlayerNotFoundInStorageEventObject
  | PlayerNameInputEventObject
  | PlayerCreatedEventObject
  | PlayerCreationFailedObject;
