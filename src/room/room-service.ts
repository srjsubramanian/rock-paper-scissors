import { Constants } from "../common";
import { IGameService } from "../game";
import { IEventListener, IEventPublisher, Reactor } from "../infra";
import { Room } from "./room";
import { IRoom, IRoomService, RoomPreview, Rooms } from "./room-types";

class RoomService extends Reactor implements IRoomService {
  private readonly rooms: Rooms = new Map();
  constructor(
    protected readonly taskResultsPublisher: IEventPublisher,
    protected readonly tasksListener: IEventListener,
    private readonly games: IGameService
  ) {
    super(taskResultsPublisher, tasksListener);
  }
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
  supportedCommands(): string[] {
    return [];
  }
  async run(task: string, data: any) {
    switch (task) {
      case Constants.CREATE_ROOM: {
        if (data?.name) {
          return this.create(data.name);
        } else {
          throw new Error("Room name required");
        }
      }
    }
  }
}

export { RoomService };
