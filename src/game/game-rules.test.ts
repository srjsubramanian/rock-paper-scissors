import { findWinner } from "./game-rules";
import { Input, Player } from "./game-types";

describe("findWinner", () => {
  test("should declare Rock vs Paper => Paper", () => {
    expect(
      findWinner({
        [Player.Player1]: Input.Rock,
        [Player.Player2]: Input.Paper,
      })
    ).toBe(Player.Player2);
  });

  test("should declare Paper vs Scissors => Scissors", () => {
    expect(
      findWinner({
        [Player.Player1]: Input.Paper,
        [Player.Player2]: Input.Scissors,
      })
    ).toBe(Player.Player2);
  });

  test("should declare Scissors vs Rock => Rock", () => {
    expect(
      findWinner({
        [Player.Player1]: Input.Scissors,
        [Player.Player2]: Input.Rock,
      })
    ).toBe(Player.Player2);
  });

  test("should identify when Player1 wins", () => {
    expect(
      findWinner({
        [Player.Player1]: Input.Rock,
        [Player.Player2]: Input.Scissors,
      })
    ).toBe(Player.Player1);
  });

  test("should return nothing when both players have chosen the same option", () => {
    expect(
      findWinner({
        [Player.Player1]: Input.Rock,
        [Player.Player2]: Input.Rock,
      })
    ).toBe(undefined);
    expect(
      findWinner({
        [Player.Player1]: Input.Paper,
        [Player.Player2]: Input.Paper,
      })
    ).toBe(undefined);
    expect(
      findWinner({
        [Player.Player1]: Input.Scissors,
        [Player.Player2]: Input.Scissors,
      })
    ).toBe(undefined);
  });

  test("should return Player 1 when Player 1 has input but Player 2 doesn't", () => {
    expect(
      findWinner({
        [Player.Player1]: Input.Paper,
      })
    ).toBe(Player.Player1);
  });

  test("should return Player 2 when Player 2 has input but Player 1 doesn't", () => {
    expect(
      findWinner({
        [Player.Player2]: Input.Paper,
      })
    ).toBe(Player.Player2);
  });
});
