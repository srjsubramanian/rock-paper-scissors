import { IGameService } from "../game";
import { IEventListener, IEventPublisher, Reactor } from "../infra";
import { Room } from "./room";
import { CREATE_ROOM, GET_ALL_ROOMS, GET_ROOM } from "./room-constants";
import { IRoom, IRoomService, RoomPreview, Rooms } from "./room-types";

class RoomService extends Reactor implements IRoomService {
  private readonly rooms: Rooms = new Map();
  constructor(
    protected readonly tasksPublisher: IEventPublisher,
    protected readonly tasksListener: IEventListener,
    private readonly stateEventsChannel: IEventPublisher,
    private readonly games: IGameService
  ) {
    super(tasksPublisher, tasksListener);
  }
  create(name: string): IRoom {
    if (this.rooms.has(name)) {
      return this.rooms.get(name) as IRoom;
    }
    const room = new Room(name, this.games, this.stateEventsChannel);
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
  supportedTasks(): string[] {
    return [CREATE_ROOM, GET_ALL_ROOMS, GET_ROOM];
  }
  async run(task: string, data: any) {
    switch (task) {
      case CREATE_ROOM: {
        if (data?.name) {
          return this.create(data.name);
        } else {
          throw new Error("Room name required");
        }
      }
      case GET_ALL_ROOMS: {
        return { rooms: this.all };
      }
      case GET_ROOM: {
        if (data?.name) {
          return { room: this.get(data.name) };
        } else {
          throw new Error("Room name required");
        }
      }
    }
  }
}

export { RoomService };
