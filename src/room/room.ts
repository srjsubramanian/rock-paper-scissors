import { interpret } from "xstate";
import { IGameService } from "../game";
import { createRoomMachine } from "./room-machine";
import {
  IRoom,
  RoomContext,
  RoomEvent,
  RoomEventObject,
  RoomState,
} from "./room-types";
import { from, map } from "rxjs";
import { IEventPublisher, StatefulEntity } from "../infra";
import { Constants } from "../common";

class Room
  extends StatefulEntity<RoomContext, RoomEventObject, RoomState>
  implements IRoom
{
  protected stateChangeEventType = Constants.ROOM_STATE_CHANGED;
  private readonly roomInstance = interpret(createRoomMachine(this.games));
  private readonly observableRoom$ = from(this.roomInstance).pipe(
    map(({ value, context }) => ({ value, context }))
  );
  constructor(
    protected readonly _id: string,
    private readonly games: IGameService,
    protected readonly stateEventsChannel?: IEventPublisher
  ) {
    super(_id, stateEventsChannel);
  }
  protected getStateChangeEventType(): string {
    return Constants.ROOM_STATE_CHANGED;
  }
  protected getMachineToTrack() {
    return this.roomInstance;
  }
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
    this.setupPublisher();
    this.roomInstance.start();
    return this;
  }
  addPlayer(player: string) {
    this.roomInstance.send({ type: RoomEvent.PlayerJoined, player });
    return this;
  }
}

export { Room };
