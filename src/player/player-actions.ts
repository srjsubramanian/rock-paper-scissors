import { assign } from "xstate";
import { PlayerContext, PlayerEventObject, PlayerEvent } from "./player-types";

export const savePlayerName = assign<PlayerContext, PlayerEventObject>(
  (context, event) => {
    if (event.type === PlayerEvent.NameInput) {
      return { ...context, name: event.name };
    }
    return context;
  }
);
export const savePlayerRoom = assign<PlayerContext, PlayerEventObject>(
  (context, event) => {
    if (event.type === PlayerEvent.RoomChosen) {
      return { ...context, room: event.room };
    }
    return context;
  }
);
export const clearPlayerRoom = assign<PlayerContext, PlayerEventObject>(
  (context) => ({
    ...context,
    room: undefined,
  })
);
