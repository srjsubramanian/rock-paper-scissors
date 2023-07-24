import { Game } from "./game";
import { GameState, Input, Player } from "./game-types";

describe("game", () => {
  let game: Game;
  const player1Name = "Sooraj";
  const player2Name = "Subramanian";
  const player1Input = Input.Paper;
  const player2Input = Input.Rock;
  beforeEach(() => {
    game = new Game();
  });
  test("should be able to initialize with player names", () => {
    expect(game.players?.[Player.Player1]).toBeUndefined();
    expect(game.players?.[Player.Player2]).toBeUndefined();
    game.initialize(player1Name);
    expect(game.players?.[Player.Player1]).toBe(player1Name);
    expect(game.players?.[Player.Player2]).toBeUndefined();
    game.addPlayer(player2Name);
    expect(game.players?.[Player.Player1]).toBe(player1Name);
    expect(game.players?.[Player.Player2]).toBe(player2Name);
  });
  test("should switch from waiting for player 2 to playing once player 2 is added", () => {
    game.initialize(player1Name);
    expect(game.state).toBe(GameState.WaitingForPlayerTwo);
    game.addPlayer(player2Name);
    expect(game.state).toBe(GameState.Playing);
  });
  test("should register player 1's inputs", () => {
    game
      .initialize(player1Name)
      .addPlayer(player2Name)
      .registerPlayerInput(Player.Player1, player1Input);
    expect(game.getPlayerInput(Player.Player1)).toBe(player1Input);
  });
  test("should register player 2's inputs", () => {
    game
      .initialize(player1Name)
      .addPlayer(player2Name)
      .registerPlayerInput(Player.Player2, player2Input);
    expect(game.getPlayerInput(Player.Player2)).toBe(player2Input);
  });
  test("should end game in a tie for same inputs from both players", () => {
    const input = Input.Paper;
    game
      .initialize(player1Name)
      .addPlayer(player2Name)
      .registerPlayerInput(Player.Player1, input)
      .registerPlayerInput(Player.Player2, input);
    expect(game.state).toBe(GameState.Playing);
    expect(game.getPlayerInput(Player.Player1)).toBeUndefined();
    expect(game.getPlayerInput(Player.Player2)).toBeUndefined();
  });
  test("should end game in a with winner when both players register inputs and don't tie", () => {
    game
      .initialize(player1Name)
      .addPlayer(player2Name)
      .registerPlayerInput(Player.Player1, player1Input)
      .registerPlayerInput(Player.Player2, player2Input);
    expect(game.state).toBe(GameState.Ended);
    expect(game.winner).toBe(Player.Player1);
    expect(game.getPlayerInput(Player.Player1)).toBeUndefined();
    expect(game.getPlayerInput(Player.Player2)).toBeUndefined();
  });
  test("should end game upon external trigger and have no winner if neither player has registered input", () => {
    game.initialize(player1Name).addPlayer(player2Name).end();
    expect(game.state).toBe(GameState.Ended);
    expect(game.winner).toBeUndefined();
    expect(game.getPlayerInput(Player.Player1)).toBeUndefined();
    expect(game.getPlayerInput(Player.Player2)).toBeUndefined();
  });
  test("should end game upon external trigger and declare winner if one player has registered input", () => {
    game
      .initialize(player1Name)
      .addPlayer(player2Name)
      .registerPlayerInput(Player.Player1, player1Input)
      .end();
    expect(game.state).toBe(GameState.Ended);
    expect(game.winner).toBe(Player.Player1);
    expect(game.getPlayerInput(Player.Player1)).toBeUndefined();
    expect(game.getPlayerInput(Player.Player2)).toBeUndefined();
  });
});
