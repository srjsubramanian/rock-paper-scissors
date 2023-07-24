import { GameState, IGame, GamePlayer } from "../game";
import { shouldAddToCurrentGame, shouldStartGame } from "./room-guards";
import { RoomContext } from "./room-types";

const player1 = "Sooraj";
const player2 = "Subramanian";
const player3 = "John";

describe("shouldStartGame", () => {
  test("should return true if the game isn't created yet and there is one player in the queue", () => {
    expect(
      shouldStartGame({ queue: [player1], board: [] } as unknown as RoomContext)
    ).toBeTruthy();
  });
  test("should return false if the game is ongoing", () => {
    expect(
      shouldStartGame({
        queue: [player1, player2, player3],
        board: [],
        game: {} as unknown as IGame,
      } as unknown as RoomContext)
    ).toBeFalsy();
  });
  test("should return false if the queue is empty", () => {
    expect(
      shouldStartGame({
        queue: [],
        board: [],
      } as unknown as RoomContext)
    ).toBeFalsy();
  });
});

describe("shouldAddToCurrentGame", () => {
  test("should return true if the game is ongoing, in waiting_for_player_2 state and a player joins the room", () => {
    expect(
      shouldAddToCurrentGame({
        queue: [player2],
        board: [],
        game: {
          state: GameState.WaitingForPlayerTwo,
          players: { [GamePlayer.Player1]: player1 },
        } as unknown as IGame,
      } as unknown as RoomContext)
    ).toBeTruthy();
  });
  test("should return false if the game is in any other state and queue has players", () => {
    expect(
      shouldAddToCurrentGame({
        queue: [player2],
        board: [],
        game: {
          state: GameState.CheckingForGameCompletion,
          players: { [GamePlayer.Player1]: player1 },
        } as unknown as IGame,
      } as unknown as RoomContext)
    ).toBeFalsy();
    expect(
      shouldAddToCurrentGame({
        queue: [player2],
        board: [],
        game: {
          state: GameState.Ended,
          players: { [GamePlayer.Player1]: player1 },
        } as unknown as IGame,
      } as unknown as RoomContext)
    ).toBeFalsy();
    expect(
      shouldAddToCurrentGame({
        queue: [player2],
        board: [],
        game: {
          state: GameState.Playing,
          players: { [GamePlayer.Player1]: player1 },
        } as unknown as IGame,
      } as unknown as RoomContext)
    ).toBeFalsy();
  });
  test("should return false if the game is in any other state and queue has no players", () => {
    expect(
      shouldAddToCurrentGame({
        queue: [],
        board: [],
        game: {
          state: GameState.CheckingForGameCompletion,
          players: { [GamePlayer.Player1]: player1 },
        } as unknown as IGame,
      } as unknown as RoomContext)
    ).toBeFalsy();
    expect(
      shouldAddToCurrentGame({
        queue: [],
        board: [],
        game: {
          state: GameState.Ended,
          players: { [GamePlayer.Player1]: player1 },
        } as unknown as IGame,
      } as unknown as RoomContext)
    ).toBeFalsy();
    expect(
      shouldAddToCurrentGame({
        queue: [],
        board: [],
        game: {
          state: GameState.Playing,
          players: { [GamePlayer.Player1]: player1 },
        } as unknown as IGame,
      } as unknown as RoomContext)
    ).toBeFalsy();
  });
  test("should return false if the queue has no players", () => {
    expect(
      shouldAddToCurrentGame({
        queue: [],
        board: [],
        game: {
          state: GameState.WaitingForPlayerTwo,
          players: { [GamePlayer.Player1]: player1 },
        } as unknown as IGame,
      } as unknown as RoomContext)
    ).toBeFalsy();
  });
});
