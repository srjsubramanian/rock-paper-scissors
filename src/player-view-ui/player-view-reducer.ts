import { INITIAL_CONTEXT } from "./player-view-constants";
import {
  PlayerViewContext,
  PlayerViewEventObject,
  PlayerViewEvent,
  NamedPlayerContext,
  PlayerViewState,
  WaitingForPlayerNameContext,
  CreatingPlayerContext,
} from "./player-view-types";

export const reducer = (
  context: PlayerViewContext = INITIAL_CONTEXT,
  event: PlayerViewEventObject
) => {
  switch (event.type) {
    case PlayerViewEvent.PlayerFoundInStorage: {
      const { name, playerId } = event;
      const newContext: NamedPlayerContext = {
        state: PlayerViewState.NamedPlayer,
        name,
        playerId,
      };
      return newContext;
    }
    case PlayerViewEvent.PlayerNotFoundInStorage: {
      const newContext: WaitingForPlayerNameContext = {
        state: PlayerViewState.WaitingForPlayerName,
      };
      return newContext;
    }
    case PlayerViewEvent.PlayerNameInput: {
      const newContext: CreatingPlayerContext = {
        state: PlayerViewState.CreatingPlayer,
      };
      return newContext;
    }
    case PlayerViewEvent.PlayerCreated: {
      const { name, playerId } = event;
      const newContext: NamedPlayerContext = {
        state: PlayerViewState.NamedPlayer,
        name,
        playerId,
      };
      return newContext;
    }
    case PlayerViewEvent.PlayerCreationFailed: {
      const newContext: WaitingForPlayerNameContext = {
        state: PlayerViewState.WaitingForPlayerName,
      };
      return newContext;
    }
    default: {
      return context;
    }
  }
};
