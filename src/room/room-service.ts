import { IGameService } from "../game";
import { Room } from "./room";
import { IRoom, IRoomService, RoomPreview, Rooms } from "./room-types";

class RoomService implements IRoomService {
  private readonly rooms: Rooms = new Map();
  constructor(private readonly games: IGameService) {}
  create(name: string): IRoom {
    if (this.rooms.has(name)) {
      return this.rooms.get(name) as IRoom;
    }
    const room = new Room(this.games);
    this.rooms.set(name, room);
    return room;
  }
  public get all(): RoomPreview[] {
    return Array.from(this.rooms).map(([name, room]) => ({
      name,
      length: room.queue.length,
      hasActiveGame: Boolean(room.game),
      totalGames: room.board.length,
    }));
  }
  public get(name: string) {
    return this.rooms.get(name);
  }
}

export { RoomService };
