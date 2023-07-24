import { interpret } from "xstate";
import { IGameService } from "../game";
import { createRoomMachine } from "./room-machine";
import { IRoom, RoomEvent, RoomState } from "./room-types";
import { from, map } from "rxjs";

class Room implements IRoom {
  private readonly roomInstance = interpret(createRoomMachine(this.games));
  private readonly observableRoom$ = from(this.roomInstance).pipe(
    map(({ value, context }) => ({ value, context }))
  );
  constructor(private readonly games: IGameService) {}
  public get state() {
    return this.roomInstance.getSnapshot().value as RoomState;
  }
  public get state$() {
    return this.observableRoom$.pipe(map(({ value }) => value as RoomState));
  }
  public get board() {
    return this.roomInstance.getSnapshot().context.board;
  }
  public get board$() {
    return this.observableRoom$.pipe(map(({ context: { board } }) => board));
  }
  public get game() {
    return this.roomInstance.getSnapshot().context.game;
  }
  public get game$() {
    return this.observableRoom$.pipe(map(({ context: { game } }) => game));
  }
  public get queue() {
    return this.roomInstance.getSnapshot().context.queue;
  }
  public get queue$() {
    return this.observableRoom$.pipe(map(({ context: { queue } }) => queue));
  }
  initialize() {
    this.roomInstance.start();
    return this;
  }
  addPlayer(player: string) {
    this.roomInstance.send({ type: RoomEvent.PlayerJoined, player });
    return this;
  }
}

export { Room };
