import { GameService } from "../game";
import { Room } from "./room";
import { IRoom, RoomState } from "./room-types";

const player1 = "Sooraj";

const mockPublisher = { publish: async () => {} };
const mockListener = { on: () => "", off: () => {} };

describe("room", () => {
  let room: IRoom;
  beforeEach(() => {
    const games = new GameService(mockPublisher, mockListener, mockPublisher);
    room = new Room("test-room", games, mockPublisher);
  });
  test("should be able to initialize", () => {
    room.initialize();
    expect(room.board).toBeDefined();
    expect(room.board).toHaveLength(0);
    expect(room.queue).toBeDefined();
    expect(room.queue).toHaveLength(0);
    expect(room.state).toBeDefined();
    expect(room.state).toBe(RoomState.RoomIdle);
  });
  test("should be able to add players", () => {
    room.initialize().addPlayer(player1);
    expect(room.queue).toHaveLength(0);
    expect(room.state).toBeDefined();
    expect(room.state).toBe(RoomState.GameInProgress);
  });
});
