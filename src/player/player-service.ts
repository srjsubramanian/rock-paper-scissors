import { nanoid } from "nanoid";
import { IPlayer, IPlayerService } from "./player-types";
import { Player } from "./player";
import { IEventListener, IEventPublisher, Reactor } from "../infra";
import { CREATE_PLAYER, GET_ALL_PLAYERS, GET_PLAYER } from "./player-constants";

class PlayerService extends Reactor implements IPlayerService {
  private readonly players = new Map<string, IPlayer>();
  constructor(
    protected readonly tasksPublisher: IEventPublisher,
    protected readonly tasksListener: IEventListener,
    private readonly stateEventsChannel: IEventPublisher
  ) {
    super(tasksPublisher, tasksListener);
  }
  create() {
    const id = nanoid();
    const player = new Player(id, this.stateEventsChannel);
    this.players.set(id, player);
    return player;
  }
  public get all() {
    return Array.from(this.players).map(([id, player]) => player);
  }
  public get(id: string) {
    return this.players.get(id);
  }
  supportedTasks(): string[] {
    return [CREATE_PLAYER, GET_ALL_PLAYERS, GET_PLAYER];
  }
  async run(task: string, data: any): Promise<any> {
    switch (task) {
      case CREATE_PLAYER: {
        if (data?.name) {
          const playerId = this.create().initialize().setName(data.name).id;
          return { playerId };
        } else {
          throw new Error("Player name is required");
        }
      }
      case GET_ALL_PLAYERS: {
        return { players: this.all };
      }
      case GET_PLAYER: {
        if (data?.id) {
          return { player: this.get(data.id) };
        } else {
          throw new Error("Player id required");
        }
      }
    }
  }
}

export { PlayerService };
