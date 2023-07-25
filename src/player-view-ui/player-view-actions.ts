import { Constants, Types } from "../common";
import { ISessionStorage } from "../common/types";
import { IForegroundWorker } from "../infra";
import { CURRENT_PLAYER_KEY } from "./player-view-constants";
import { PlayerViewEvent, PlayerViewEventObject } from "./player-view-types";

type DispatchType = React.Dispatch<PlayerViewEventObject>;

export const checkForPlayer = (
  dispatch: DispatchType,
  {
    sessionStorage,
  }: {
    sessionStorage: Types.ISessionStorage;
  }
) => {
  const storedPlayer = sessionStorage.getItem(CURRENT_PLAYER_KEY);
  if (storedPlayer) {
    const player: { playerId: string; name: string } = JSON.parse(storedPlayer);
    if (player) {
      dispatch({ type: PlayerViewEvent.PlayerFoundInStorage, ...player });
      return;
    }
  }
  dispatch({ type: PlayerViewEvent.PlayerNotFoundInStorage });
};

export const createPlayer = async (
  {
    name,
  }: {
    name: string;
  },
  dispatch: DispatchType,
  {
    foregroundWorker,
    sessionStorage,
  }: { foregroundWorker: IForegroundWorker; sessionStorage: ISessionStorage }
) => {
  try {
    const result = await foregroundWorker.run<{ playerId: string }>(
      Constants.CREATE_PLAYER,
      {
        name,
      }
    );
    const playerId = result?.playerId;
    if (playerId) {
      sessionStorage.setItem(
        CURRENT_PLAYER_KEY,
        JSON.stringify({ playerId, name })
      );
      dispatch({
        type: PlayerViewEvent.PlayerCreated,
        playerId,
        name,
      });
    } else {
      dispatch({
        type: PlayerViewEvent.PlayerCreationFailed,
        error: "Could not create player",
      });
    }
  } catch (error) {
    dispatch({
      type: PlayerViewEvent.PlayerCreationFailed,
      error: error as string,
    });
  }
};
