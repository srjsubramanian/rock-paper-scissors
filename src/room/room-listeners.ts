import { Observable, Subject, map } from "rxjs";
import { RoomContext, RoomEvent, RoomEventObject } from "./room-types";
import { GameState } from "../game";

export const listenToGameEndEvent = (
  context: RoomContext
): Observable<RoomEventObject> => {
  if (context.game?.state$) {
    return context.game?.state$?.pipe(
      map((state) => {
        if (state === GameState.Ended) {
          return {
            type: RoomEvent.GameEnded,
            winner: context.game?.winner,
          };
        }
        return { type: RoomEvent.InsignificantEvent };
      })
    );
  }
  return new Subject();
};
