import { Subject } from "rxjs";
import { GameState, IGame } from "../game";
import { listenToGameEndEvent } from "./room-listeners";
import {
  GameEndedEvent,
  RoomContext,
  RoomEvent,
  RoomEventObject,
} from "./room-types";

describe("listenToGameEndEvent", () => {
  test("should emit game ended event when game's state changes to game ended", () => {
    const mockState$ = new Subject<GameState>();
    const mockContext: RoomContext = {
      queue: [],
      board: [],
      game: {
        state$: mockState$,
      } as unknown as IGame,
    } as unknown as RoomContext;
    const events$ = listenToGameEndEvent(mockContext);
    const eventsEmitted: RoomEventObject[] = [];
    const eventsSubscription = events$.subscribe((event) =>
      eventsEmitted.push(event)
    );

    expect(eventsEmitted).toHaveLength(0);
    mockState$.next(GameState.Ended);
    expect(eventsEmitted).toHaveLength(1);
    expect(eventsEmitted[0].type).toBe(RoomEvent.GameEnded);
    expect((eventsEmitted[0] as GameEndedEvent).winner).toBeUndefined();

    eventsSubscription.unsubscribe();
  });
});
