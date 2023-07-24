import { nanoid } from "nanoid";
import { IPlayer, IPlayerService } from "./player-types";
import { Player } from "./player";
import { Constants } from "../common";
import { Reactor } from "../infra";

class PlayerService extends Reactor implements IPlayerService {
  private readonly players = new Map<string, IPlayer>();
  create() {
    const id = nanoid();
    const player = new Player(id);
    this.players.set(id, player);
    return player;
  }
  supportedCommands(): string[] {
    return [Constants.CREATE_PLAYER];
  }
  async run(task: string, data: any): Promise<any> {
    switch (task) {
      case Constants.CREATE_PLAYER: {
        if (data?.name) {
          const playerId = this.create().initialize().setName(data.name).id;
          return { playerId };
        } else {
          throw new Error("Player name is required");
        }
      }
    }
  }
}

export { PlayerService };
