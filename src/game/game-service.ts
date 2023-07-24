import { Reactor } from "../infra";
import { Game } from "./game";
import { IGame, IGameService } from "./game-types";
import { nanoid } from "nanoid";

class GameService extends Reactor implements IGameService {
  private readonly games = new Map<string, IGame>();
  create(): IGame {
    const id = nanoid();
    const game = new Game();
    this.games.set(id, game);
    return game;
  }
  supportedCommands(): string[] {
    return [];
  }
  async run(task: string, data: any): Promise<any> {}
}

export { GameService };
