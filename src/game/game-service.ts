import { IEventListener, IEventPublisher, Reactor } from "../infra";
import { Game } from "./game";
import { GET_ALL_GAMES, GET_GAME } from "./game-constants";
import { IGame, IGameService } from "./game-types";
import { nanoid } from "nanoid";

class GameService extends Reactor implements IGameService {
  private readonly games = new Map<string, IGame>();
  constructor(
    protected readonly tasksPublisher: IEventPublisher,
    protected readonly tasksListener: IEventListener,
    private readonly stateEventsChannel: IEventPublisher
  ) {
    super(tasksPublisher, tasksListener);
  }
  create(): IGame {
    const id = nanoid();
    const game = new Game(id, this.stateEventsChannel);
    this.games.set(id, game);
    return game;
  }
  public get all() {
    return Array.from(this.games).map(([id, game]) => game);
  }
  public get(id: string) {
    return this.games.get(id);
  }
  supportedTasks(): string[] {
    return [GET_ALL_GAMES, GET_GAME];
  }
  async run(task: string, data: any): Promise<any> {
    switch (task) {
      case GET_ALL_GAMES: {
        return { games: this.all };
      }
      case GET_GAME: {
        if (data?.id) {
          return { game: this.get(data.id) };
        } else {
          throw new Error("Game id required");
        }
      }
    }
  }
}

export { GameService };
