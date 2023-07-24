import { assign } from "xstate";
import {
  GameLog,
  PlayerMap,
  RoomContext,
  RoomEvent,
  RoomEventObject,
} from "./room-types";
import { Player } from "../game/game-types";

export const addPlayerToQueue = assign<RoomContext, RoomEventObject>(
  (context, event) => {
    if (event.type === RoomEvent.PlayerJoined) {
      const queue = [...context.queue, event.player];
      return { ...context, queue };
    }
    return context;
  }
);

export const startGame = assign<RoomContext, RoomEventObject>((context) => {
  const queue = [...context.queue];
  const player1 = queue.shift();
  const players: PlayerMap = {};
  if (player1) {
    players[Player.Player1] = player1;
    const game = context.games.create().initialize(player1);
    const player2 = queue.shift();
    if (player2) {
      players[Player.Player2] = player2;
      game.addPlayer(player2);
    }
    return { ...context, game, queue, players };
  }
  return context;
});

export const addToCurrentGame = assign<RoomContext, RoomEventObject>(
  (context) => {
    const queue = [...context.queue];
    const players = { ...context.players };
    const player2 = queue.shift();
    if (player2 && context.game) {
      players[Player.Player2] = player2;
      const game = context.game.addPlayer(player2);
      return { ...context, game, queue, players };
    }
    return context;
  }
);

export const logGameResultAndCleanup = assign<RoomContext, RoomEventObject>(
  (context) => {
    if (context.game) {
      const { players, winner } = context.game;
      const log: GameLog = {
        players,
        winner: winner && context.players?.[winner],
      };
      const board = [...context.board, log];
      return { ...context, board, game: undefined, players: undefined };
    }
    return context;
  }
);
