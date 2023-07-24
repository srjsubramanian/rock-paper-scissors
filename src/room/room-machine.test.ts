import { Subscription, interpret } from "xstate";
import { createRoomMachine } from "./room-machine";
import { RoomContext, RoomEvent, RoomState } from "./room-types";
import { GameInput, GamePlayer, GameService, GameState } from "../game";

const games = new GameService(
  { publish: async () => {} },
  { on: () => "", off: () => {} }
);
/**
 * If this is mocked, acts more like unit test for room-machine.
 * But with the actual GameService, acts more like integration test
 *  */

const initRoomMachine = () => interpret(createRoomMachine(games)).start();

describe("gameRoomMachine", () => {
  const player1 = "Sooraj";
  const player2 = "Subramanian";
  const player3 = "John";
  const player4 = "Doe";
  const player5 = "Jeff";
  const player6 = "Bezos";
  let roomState = initRoomMachine(),
    roomContext: RoomContext,
    roomContextSubscription: Subscription;
  beforeEach(() => {
    roomState = initRoomMachine();
    roomContextSubscription = roomState.subscribe((state) => {
      roomContext = state.context;
    });
  });
  afterEach(() => {
    roomContextSubscription?.unsubscribe();
  });
  test("should be idle and have an empty queue once created", () => {
    const state = roomState.getSnapshot();
    expect(state.matches(RoomState.RoomIdle)).toBeTruthy();
    expect(state.context.queue).toBeDefined();
    expect(state.context.queue).toHaveLength(0);
    expect(state.context.board).toBeDefined();
    expect(state.context.board).toHaveLength(0);
  });
  test("should start a game with game state as waiting for player 2 when the first player is added to the room", () => {
    roomState.send({ type: RoomEvent.PlayerJoined, player: player1 });
    const state = roomState.getSnapshot();
    expect(state.matches(RoomState.GameInProgress)).toBeTruthy();
    expect(state.context.queue).toHaveLength(0);
    expect(state.context.board).toHaveLength(0);
    expect(state.context.players?.[GamePlayer.Player1]).toBe(player1);
    expect(state.context.game).toBeDefined();
    expect(state.context.game?.state).toBe(GameState.WaitingForPlayerTwo);
    expect(state.context.game?.players?.[GamePlayer.Player1]).toBe(player1);
    expect(state.context.game?.players?.[GamePlayer.Player2]).toBeUndefined();
  });
  test("should add the second player to the ongoing game with game state changing to playing when a second player is added to the room", () => {
    roomState.send({ type: RoomEvent.PlayerJoined, player: player1 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player2 });
    const state = roomState.getSnapshot();
    expect(state.context.queue).toHaveLength(0);
    expect(state.context.board).toHaveLength(0);
    expect(state.context.players?.[GamePlayer.Player1]).toBe(player1);
    expect(state.context.players?.[GamePlayer.Player2]).toBe(player2);
    expect(state.context.game).toBeDefined();
    expect(state.context.game?.state).toBe(GameState.Playing);
    expect(state.context.game?.players?.[GamePlayer.Player1]).toBe(player1);
    expect(state.context.game?.players?.[GamePlayer.Player2]).toBe(player2);
  });
  test("should add the new players to the queue while a game is ongoing with two players", () => {
    roomState.send({ type: RoomEvent.PlayerJoined, player: player1 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player2 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player3 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player4 });
    const state = roomState.getSnapshot();
    expect(state.context.queue).toHaveLength(2);
    expect(state.context.queue[0]).toBe(player3);
    expect(state.context.queue[1]).toBe(player4);
    expect(state.context.board).toHaveLength(0);
    expect(state.context.players?.[GamePlayer.Player1]).toBe(player1);
    expect(state.context.players?.[GamePlayer.Player2]).toBe(player2);
    expect(state.context.game).toBeDefined();
    expect(state.context.game?.state).toBe(GameState.Playing);
    expect(state.context.game?.players?.[GamePlayer.Player1]).toBe(player1);
    expect(state.context.game?.players?.[GamePlayer.Player2]).toBe(player2);
  });
  test("should go back to idle when only two players are in the room and the game ends", () => {
    roomState.send({ type: RoomEvent.PlayerJoined, player: player1 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player2 });
    const state = roomState.getSnapshot();
    const { game } = state.context;
    expect(game).toBeDefined();
    expect(game?.state).toBe(GameState.Playing);
    game?.registerPlayerInput(GamePlayer.Player1, GameInput.Paper);
    game?.registerPlayerInput(GamePlayer.Player2, GameInput.Rock);
    expect(game?.state).toBe(GameState.Ended);
    const newState = roomState.getSnapshot();
    expect(newState.matches(RoomState.RoomIdle)).toBeTruthy();
  });
  test("should create a new game and log the results of the game ended where there are players are in the room and every game ends", () => {
    roomState.send({ type: RoomEvent.PlayerJoined, player: player1 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player2 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player3 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player4 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player5 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player6 });
    const state1 = roomState.getSnapshot();
    const { game: game1 } = state1.context;
    game1?.registerPlayerInput(GamePlayer.Player1, GameInput.Paper);
    game1?.registerPlayerInput(GamePlayer.Player2, GameInput.Rock);
    const state2 = roomState.getSnapshot();
    expect(state2.matches(RoomState.GameInProgress)).toBeTruthy();
    expect(state2.context.board).toHaveLength(1);
    expect(state2.context.board[0]).toBeDefined();
    expect(state2.context.board[0].players[GamePlayer.Player1]).toBe(player1);
    expect(state2.context.board[0].players[GamePlayer.Player2]).toBe(player2);
    expect(state2.context.board[0].winner).toBeDefined();
    expect(state2.context.board[0].winner).toBe(player1);
    const { game: game2 } = state2.context;
    expect(game2).toBeDefined();
    expect(game2?.players[GamePlayer.Player1]).toBe(player3);
    expect(game2?.players[GamePlayer.Player2]).toBe(player4);
    game2?.registerPlayerInput(GamePlayer.Player1, GameInput.Scissors);
    game2?.registerPlayerInput(GamePlayer.Player2, GameInput.Rock);
    const state3 = roomState.getSnapshot();
    expect(state3.matches(RoomState.GameInProgress)).toBeTruthy();
    expect(state3.context.board).toHaveLength(2);
    expect(state3.context.board[1]).toBeDefined();
    expect(state3.context.board[1].players[GamePlayer.Player1]).toBe(player3);
    expect(state3.context.board[1].players[GamePlayer.Player2]).toBe(player4);
    expect(state3.context.board[1].winner).toBeDefined();
    expect(state3.context.board[1].winner).toBe(player4);
    const { game: game3 } = state3.context;
    expect(game3).toBeDefined();
    expect(game3?.players[GamePlayer.Player1]).toBe(player5);
    expect(game3?.players[GamePlayer.Player2]).toBe(player6);
  });
  test("should continue restart game with same players if tied while there are still players in the queue", () => {
    roomState.send({ type: RoomEvent.PlayerJoined, player: player1 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player2 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player3 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player4 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player5 });
    roomState.send({ type: RoomEvent.PlayerJoined, player: player6 });
    const state1 = roomState.getSnapshot();
    const { game: game1 } = state1.context;
    game1?.registerPlayerInput(GamePlayer.Player1, GameInput.Paper);
    game1?.registerPlayerInput(GamePlayer.Player2, GameInput.Paper);
    const state2 = roomState.getSnapshot();
    expect(state2.matches(RoomState.GameInProgress)).toBeTruthy();
    expect(game1?.players?.[GamePlayer.Player1]).toBe(player1);
    expect(game1?.players?.[GamePlayer.Player2]).toBe(player2);
  });
});
