import { nanoid } from "nanoid";
import { IPlayer } from "./player-types";
import { Player } from "./player";

interface IPlayerService {
  create(): IPlayer;
}

class PlayerService implements IPlayerService {
  private readonly players = new Map<string, IPlayer>();
  create() {
    const id = nanoid();
    const player = new Player();
    this.players.set(id, player);
    return player;
  }
}

export { PlayerService };
