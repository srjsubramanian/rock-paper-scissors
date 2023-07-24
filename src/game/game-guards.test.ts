import {
  canEndGameOnPlayerInputRegisteredEvent,
  hasWinner,
  haveBothPlayersInput,
  isTie,
  shouldEndGame,
} from "./game-guards";
import { Input, Player } from "./game-types";

describe("haveBothPlayersInput", () => {
  test("should return false on at least one missing input", () => {
    expect(haveBothPlayersInput({ inputs: {} })).toBe(false);
    expect(
      haveBothPlayersInput({ inputs: { [Player.Player1]: Input.Paper } })
    ).toBe(false);
    expect(
      haveBothPlayersInput({ inputs: { [Player.Player2]: Input.Paper } })
    ).toBe(false);
  });

  test("should return true when both inputs exist", () => {
    expect(
      haveBothPlayersInput({
        inputs: {
          [Player.Player1]: Input.Paper,
          [Player.Player2]: Input.Rock,
        },
      })
    ).toBe(true);
  });
});

describe("hasWinner", () => {
  test("should return false when either input is missing", () => {
    expect(hasWinner({ inputs: { [Player.Player1]: Input.Paper } })).toBe(
      false
    );
    expect(hasWinner({ inputs: { [Player.Player2]: Input.Paper } })).toBe(
      false
    );
  });

  test("should return false when tie", () => {
    expect(
      hasWinner({
        inputs: {
          [Player.Player1]: Input.Paper,
          [Player.Player2]: Input.Paper,
        },
      })
    ).toBe(false);
  });
  test("should return true when both inputs present and not equal", () => {
    expect(
      hasWinner({
        inputs: {
          [Player.Player1]: Input.Paper,
          [Player.Player2]: Input.Scissors,
        },
      })
    ).toBe(true);
  });
});

describe("canEndGameOnPlayerInputRegisteredEvent", () => {
  test("should return false when the other input is empty", () => {
    expect(
      canEndGameOnPlayerInputRegisteredEvent({
        inputs: { [Player.Player1]: Input.Paper },
      })
    ).toBe(false);
    expect(
      canEndGameOnPlayerInputRegisteredEvent({
        inputs: { [Player.Player2]: Input.Paper },
      })
    ).toBe(false);
  });
  test("should return false when there's a tie", () => {
    expect(
      canEndGameOnPlayerInputRegisteredEvent({
        inputs: {
          [Player.Player1]: Input.Paper,
          [Player.Player2]: Input.Paper,
        },
      })
    ).toBe(false);
  });
  test("should return true when both inputs are present and there's a definitive winner", () => {
    expect(
      canEndGameOnPlayerInputRegisteredEvent({
        inputs: {
          [Player.Player1]: Input.Scissors,
          [Player.Player2]: Input.Paper,
        },
      })
    ).toBe(true);
  });
});

describe("isTie", () => {
  test("should return true when both inputs are same", () => {
    expect(
      isTie({
        inputs: { [Player.Player1]: Input.Rock, [Player.Player2]: Input.Rock },
      })
    ).toBeTruthy();
  });
  test("should return false when both inputs are present but different", () => {
    expect(
      isTie({
        inputs: { [Player.Player1]: Input.Rock, [Player.Player2]: Input.Paper },
      })
    ).toBeFalsy();
  });
});

describe("shouldEndGame", () => {
  test("should return shouldEndGame from context", () => {
    expect(
      shouldEndGame({
        shouldEndGame: true,
      })
    ).toBeTruthy();
    expect(
      shouldEndGame({
        shouldEndGame: false,
      })
    ).toBeFalsy();
    expect(shouldEndGame({ shouldEndGame: false })).toBeFalsy();
  });
});
