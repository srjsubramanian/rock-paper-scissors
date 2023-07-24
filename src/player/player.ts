import { interpret } from "xstate";
import { playerMachine } from "./player-machine";
import { IPlayer, PlayerEvent, PlayerState } from "./player-types";
import { from, map } from "rxjs";

class Player implements IPlayer {
  constructor(private readonly _id: string) {}
  private readonly playerInstance = interpret(playerMachine);
  private readonly observablePlayer$ = from(this.playerInstance).pipe(
    map(({ value, context }) => ({ value, context }))
  );
  public get id() {
    return this._id;
  }
  public get state() {
    return this.playerInstance.getSnapshot().value as PlayerState;
  }
  public get state$() {
    return this.observablePlayer$.pipe(
      map(({ value }) => value as PlayerState)
    );
  }
  public get name() {
    return this.playerInstance.getSnapshot().context.name as string;
  }
  public get name$() {
    return this.observablePlayer$.pipe(
      map(({ context: { name } }) => name as string)
    );
  }
  public get room() {
    return this.playerInstance.getSnapshot().context.room as string;
  }
  public get room$() {
    return this.observablePlayer$.pipe(
      map(({ context: { room } }) => room as string)
    );
  }
  initialize() {
    this.playerInstance.start();
    console.log("player initialised");
    return this;
  }
  setName(name: string) {
    this.playerInstance.send({ type: PlayerEvent.NameInput, name });
    console.log("player name set");
    console.log({ name });
    return this;
  }
  setRoom(room: string) {
    this.playerInstance.send({ type: PlayerEvent.RoomChosen, room });
    return this;
  }
  exitRoom() {
    this.playerInstance.send({ type: PlayerEvent.ExitFromRoom });
    return this;
  }
}

export { Player };
