import { Player } from "./player";
import { PlayerState } from "./player-types";

const playerName = "Sooraj";
const playerRoom = "A3311";

describe("player", () => {
  let player = new Player();
  beforeEach(() => {
    player = new Player();
  });
  test("should initialize with waiting_for_name state", () => {
    player.initialize();
    expect(player.state).toBe(PlayerState.WaitingForName);
  });
  test("should capture name and switch to waiting_for_room state when name is set", () => {
    player.initialize().setName(playerName);
    expect(player.state).toBe(PlayerState.WaitingToChooseRoom);
    expect(player.name).toBe(playerName);
    expect(player.room).toBeUndefined();
  });
  test("should capture room and switch to player_in_room state when room is set", () => {
    player.initialize().setName(playerName).setRoom(playerRoom);
    expect(player.state).toBe(PlayerState.PlayerInRoom);
    expect(player.name).toBe(playerName);
    expect(player.room).toBe(playerRoom);
  });
  test("should clear room and switch to waiting_for_room state when player exits room", () => {
    player.initialize().setName(playerName).setRoom(playerRoom).exitRoom();
    expect(player.state).toBe(PlayerState.WaitingToChooseRoom);
    expect(player.name).toBe(playerName);
    expect(player.room).toBeUndefined();
  });
});
