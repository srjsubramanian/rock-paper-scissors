import { Game } from "./game";
import { IGame, IGameService } from "./game-types";
import { nanoid } from "nanoid";

class GameService implements IGameService {
  private readonly games = new Map<string, IGame>();
  create(): IGame {
    const id = nanoid();
    const game = new Game();
    this.games.set(id, game);
    return game;
  }
}

export { GameService };
