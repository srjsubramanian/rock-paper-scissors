import { interpret } from "xstate";
import { gameMachine } from "./game-machine";
import {
  GameContext,
  GameEvent,
  GameEventObject,
  GameState,
  IGame,
  Input,
  Player,
} from "./game-types";
import { from, map } from "rxjs";
import { IEventPublisher, StatefulEntity } from "../infra";
import { GAME_STATE_CHANGED } from "./game-constants";

class Game
  extends StatefulEntity<GameContext, GameEventObject, GameState>
  implements IGame
{
  protected stateChangeEventType = GAME_STATE_CHANGED;
  private player1: string | undefined;
  private player2: string | undefined;
  private readonly gameInstance = interpret(gameMachine);
  constructor(
    protected readonly _id: string,
    protected readonly stateEventsChannel?: IEventPublisher
  ) {
    super(_id, stateEventsChannel);
  }
  protected getStateChangeEventType(): string {
    return GAME_STATE_CHANGED;
  }
  protected getMachineToTrack() {
    return this.gameInstance;
  }

  public get state$() {
    return from(this.gameInstance).pipe(
      map((stateNode) => stateNode.value as GameState)
    );
  }
  public get state() {
    return this.gameInstance.getSnapshot().value as GameState;
  }
  public get players() {
    return {
      [Player.Player1]: this.player1,
      [Player.Player2]: this.player2,
    };
  }
  public get winner() {
    return this.gameInstance.getSnapshot().context.winner;
  }
  public initialize(player1: string) {
    this.setupPublisher();
    this.player1 = player1;
    this.gameInstance.start();
    return this;
  }
  addPlayer(player2: string) {
    if (
      this.gameInstance.getSnapshot().value === GameState.WaitingForPlayerTwo
    ) {
      this.player2 = player2;
      this.gameInstance.send({ type: GameEvent.PlayerTwoJoined });
    }
    return this;
  }
  registerPlayerInput(player: Player, input: Input) {
    this.gameInstance.send({
      type: GameEvent.PlayerInputRegistered,
      inputs: { [player]: input },
    });
    return this;
  }
  getPlayerInput(player: Player) {
    return this.gameInstance.getSnapshot().context.inputs?.[player];
  }
  end() {
    this.gameInstance.send({ type: GameEvent.EndGameGracefully });
  }
}

export { Game };
