import { RoomContext } from "./room-types";

export const ROOM_DEFAULT_CONTEXT: Omit<RoomContext, "games"> = {
  queue: [],
  board: [],
};

export const CREATE_ROOM = "CREATE_ROOM";
export const GET_ALL_ROOMS = "GET_ALL_ROOMS";
export const GET_ROOM = "GET_ROOM";
export const ROOM_STATE_CHANGED = "ROOM_STATE_CHANGED";
