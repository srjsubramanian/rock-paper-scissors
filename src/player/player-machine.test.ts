import { Subscription, interpret } from "xstate";
import { playerMachine } from "./player-machine";
import { PlayerContext, PlayerEvent, PlayerState } from "./player-types";

const initPlayerMachine = () => interpret(playerMachine).start();
const player = "Sooraj";
const room = "A311";

describe("playerMachine", () => {
  let playerState = initPlayerMachine(),
    playerContext: PlayerContext,
    playerContextSubscription: Subscription;
  beforeEach(() => {
    playerState = initPlayerMachine();
    playerContextSubscription = playerState.subscribe((state) => {
      playerContext = state.context;
    });
  });
  afterEach(() => {
    playerContextSubscription?.unsubscribe();
  });
  test("should initialize in waiting_for_name state", () => {
    const state = playerState.getSnapshot();
    expect(state.matches(PlayerState.WaitingForName)).toBeTruthy();
    expect(state.context.name).toBeUndefined();
    expect(state.context.room).toBeUndefined();
  });
  test("should capture player name", () => {
    playerState.send({ type: PlayerEvent.NameInput, name: player });
    const state = playerState.getSnapshot();
    expect(state.matches(PlayerState.WaitingToChooseRoom)).toBeTruthy();
    expect(state.context.name).toBeDefined();
    expect(state.context.name).toBe(player);
    expect(state.context.room).toBeUndefined();
  });
  test("should capture room chosen", () => {
    playerState.send({ type: PlayerEvent.NameInput, name: player });
    playerState.send({ type: PlayerEvent.RoomChosen, room });
    const state = playerState.getSnapshot();
    expect(state.matches(PlayerState.PlayerInRoom)).toBeTruthy();
    expect(state.context.name).toBeDefined();
    expect(state.context.name).toBe(player);
    expect(state.context.room).toBeDefined();
    expect(state.context.room).toBe(room);
  });
  test("should clear room exited", () => {
    playerState.send({ type: PlayerEvent.NameInput, name: player });
    playerState.send({ type: PlayerEvent.RoomChosen, room });
    playerState.send({ type: PlayerEvent.ExitFromRoom });
    const state = playerState.getSnapshot();
    expect(state.matches(PlayerState.WaitingToChooseRoom)).toBeTruthy();
    expect(state.context.name).toBeDefined();
    expect(state.context.name).toBe(player);
    expect(state.context.room).toBeUndefined();
  });
});
