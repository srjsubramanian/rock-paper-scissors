import { PlayerViewState } from "./player-view-types";
import { CheckingForPlayer } from "./CheckingForPlayer";
import { Box } from "@mui/material";
import { Flipper } from "react-flip-toolkit";

import { WaitingForPlayerName } from "./WaitingForPlayerName";
import { PlayerViewDependencies, usePlayerView } from "./usePlayerView";
import { Channels, ForegroundWorker } from "../infra";
import { CreatingPlayer } from "./CreatingPlayer";
import { Player } from "../player-ui";

const dependencies: PlayerViewDependencies = {
  sessionStorage: sessionStorage,
  foregroundWorker: new ForegroundWorker(
    Channels.tasksPublisher,
    Channels.tasksListener,
    Channels.stateEventsListener
  ),
};

const PlayerView = () => {
  const { context, onNameInput } = usePlayerView(dependencies);
  const renderSwitch = () => {
    switch (context.state) {
      case PlayerViewState.CheckingIfPlayer: {
        return <CheckingForPlayer />;
      }
      case PlayerViewState.WaitingForPlayerName: {
        return <WaitingForPlayerName onNameInput={onNameInput} />;
      }
      case PlayerViewState.CreatingPlayer: {
        return <CreatingPlayer />;
      }
      case PlayerViewState.NamedPlayer: {
        return <Player playerId={context.playerId} name={context.name} />;
      }
      case PlayerViewState.Error: {
        return <>{context.error}</>;
      }
    }
  };
  return (
    <Box
      sx={{ height: "inherit", width: "100%" }}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Flipper flipKey={context.state}>{renderSwitch()}</Flipper>
    </Box>
  );
};

export { PlayerView };
