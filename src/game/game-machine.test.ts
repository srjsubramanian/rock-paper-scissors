import { Subscription, interpret } from "xstate";
import { gameMachine } from "./game-machine";
import { GameContext, GameEvent, GameState, Input, Player } from "./game-types";

const initGameMachine = () => interpret(gameMachine).start();

describe("gameMachine", () => {
  let gameState = initGameMachine(),
    gameContext: GameContext,
    gameContextSubscription: Subscription;
  beforeEach(() => {
    gameState = initGameMachine();
    gameContextSubscription = gameState.subscribe((state) => {
      gameContext = state.context;
    });
  });
  afterEach(() => {
    gameContextSubscription?.unsubscribe();
  });
  test("should start with waiting_for_player_2 as the initial state", () => {
    const state = gameState.getSnapshot();
    expect(state.matches(GameState.WaitingForPlayerTwo)).toBeTruthy();
  });
  test("should start playing once player 2 joins", () => {
    gameState.send({ type: GameEvent.PlayerTwoJoined });
    const state = gameState.getSnapshot();
    expect(state.matches(GameState.Playing)).toBeTruthy();
  });
  test("should capture player 1 input correctly while playing", () => {
    gameState.send({ type: GameEvent.PlayerTwoJoined });
    const player1Input = Input.Paper;
    gameState.send({
      type: GameEvent.PlayerInputRegistered,
      inputs: { [Player.Player1]: player1Input },
    });
    const state = gameState.getSnapshot();
    expect(state.matches(GameState.Playing)).toBeTruthy();
    expect(state.context.inputs?.[Player.Player1]).toBe(player1Input);
  });
  test("should capture player 2 input correctly while playing", () => {
    gameState.send({ type: GameEvent.PlayerTwoJoined });
    const player2Input = Input.Paper;
    gameState.send({
      type: GameEvent.PlayerInputRegistered,
      inputs: { [Player.Player2]: player2Input },
    });
    const state = gameState.getSnapshot();
    expect(state.matches(GameState.Playing)).toBeTruthy();
    expect(gameContext.inputs?.[Player.Player2]).toBe(player2Input);
  });
  test("should restart game on tie with context when both players choose same input", () => {
    gameState.send({ type: GameEvent.PlayerTwoJoined });
    const playerInput = Input.Paper;
    gameState.send({
      type: GameEvent.PlayerInputRegistered,
      inputs: { [Player.Player1]: playerInput },
    });
    gameState.send({
      type: GameEvent.PlayerInputRegistered,
      inputs: { [Player.Player2]: playerInput },
    });
    const state = gameState.getSnapshot();
    expect(state.matches(GameState.Playing)).toBeTruthy();
    expect(gameContext.lastGameEndedExternally).toBeFalsy();
    expect(gameContext.shouldEndGame).toBeFalsy();
    expect(gameContext.lastRoundTie).toBeTruthy();
    expect(gameContext.inputs?.[Player.Player1]).toBeUndefined();
    expect(gameContext.inputs?.[Player.Player2]).toBeUndefined();
  });
  test("should end game with a winner when both players have inputs captured and one player has won the other", () => {
    gameState.send({ type: GameEvent.PlayerTwoJoined });
    const player1Input = Input.Paper;
    const player2Input = Input.Scissors;
    gameState.send({
      type: GameEvent.PlayerInputRegistered,
      inputs: { [Player.Player1]: player1Input },
    });
    gameState.send({
      type: GameEvent.PlayerInputRegistered,
      inputs: { [Player.Player2]: player2Input },
    });
    const state = gameState.getSnapshot();
    expect(state.matches(GameState.Ended)).toBeTruthy();
    expect(gameContext.lastGameEndedExternally).toBeFalsy();
    expect(gameContext.shouldEndGame).toBeFalsy();
    expect(gameContext.lastRoundTie).toBeFalsy();
    expect(gameContext.inputs?.[Player.Player1]).toBeUndefined();
    expect(gameContext.inputs?.[Player.Player2]).toBeUndefined();
    expect(gameContext.winner).toBe(Player.Player2);
  });
  test("should end game upon external trigger with a winner when only one player has input captured", () => {
    gameState.send({ type: GameEvent.PlayerTwoJoined });
    const player1Input = Input.Paper;
    gameState.send({
      type: GameEvent.PlayerInputRegistered,
      inputs: { [Player.Player1]: player1Input },
    });
    gameState.send({
      type: GameEvent.EndGameGracefully,
    });
    const state = gameState.getSnapshot();
    expect(state.matches(GameState.Ended)).toBeTruthy();
    expect(gameContext.lastGameEndedExternally).toBeTruthy();
    expect(gameContext.shouldEndGame).toBeFalsy();
    expect(gameContext.lastRoundTie).toBeFalsy();
    expect(gameContext.inputs?.[Player.Player1]).toBeUndefined();
    expect(gameContext.inputs?.[Player.Player2]).toBeUndefined();
    expect(gameContext.winner).toBe(Player.Player1);
  });
  test("should end game upon external trigger with no winner when neither player has an input", () => {
    gameState.send({ type: GameEvent.PlayerTwoJoined });
    gameState.send({ type: GameEvent.EndGameGracefully });
    const state = gameState.getSnapshot();
    expect(state.matches(GameState.Ended)).toBeTruthy();
    expect(gameContext.lastGameEndedExternally).toBeTruthy();
    expect(gameContext.shouldEndGame).toBeFalsy();
    expect(gameContext.lastRoundTie).toBeFalsy();
    expect(gameContext.inputs?.[Player.Player1]).toBeUndefined();
    expect(gameContext.inputs?.[Player.Player2]).toBeUndefined();
  });
});
