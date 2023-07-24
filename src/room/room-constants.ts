import { RoomContext } from "./room-types";

export const ROOM_DEFAULT_CONTEXT: Omit<RoomContext, "games"> = {
  queue: [],
  board: [],
};
