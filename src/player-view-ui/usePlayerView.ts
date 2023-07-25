import { useReducer, useEffect } from "react";
import { checkForPlayer, createPlayer } from "./player-view-actions";
import { INITIAL_CONTEXT } from "./player-view-constants";
import { reducer } from "./player-view-reducer";
import { PlayerViewState } from "./player-view-types";
import { ISessionStorage } from "../common/types";
import { IForegroundWorker } from "../infra";

export type PlayerViewDependencies = {
  sessionStorage: ISessionStorage;
  foregroundWorker: IForegroundWorker;
};

const usePlayerView = ({
  sessionStorage,
  foregroundWorker,
}: PlayerViewDependencies) => {
  const [context, dispatch] = useReducer(reducer, INITIAL_CONTEXT);
  useEffect(() => {
    switch (context.state) {
      case PlayerViewState.CheckingIfPlayer: {
        checkForPlayer(dispatch, { sessionStorage });
      }
    }
  }, [context.state]);
  const onNameInput = (name: string) =>
    createPlayer({ name }, dispatch, { foregroundWorker, sessionStorage });
  return { context, onNameInput };
};

export { usePlayerView };
