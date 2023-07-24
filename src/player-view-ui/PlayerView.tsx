import { useEffect } from "react";
import { ForegroundWorker } from "../infra";
import { Channels } from "../infra";

const foregroundWorker = new ForegroundWorker(
  Channels.uiCommandsPublisher,
  Channels.uiCommandResultsListener
);

const CURRENT_PLAYER_KEY = "CURRENT_PLAYER";

const createPlayer = async (name: string) => {
  try {
    const { playerId } = await foregroundWorker.createPlayerWithName("Sooraj");
    const playerToStore = { playerId, name };
    sessionStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(playerToStore));
  } catch (error) {
    console.log({ error });
  }
};

const getCurrentPlayer = () => {
  const storedPlayer = sessionStorage.getItem(CURRENT_PLAYER_KEY);
  if (storedPlayer) {
    const player: { playerId: string; name: string } = JSON.parse(storedPlayer);
    return player;
  }
};

const PlayerView = () => {
  useEffect(() => {
    console.log("check if player exists for this tab in session storage");
    const currentPlayer = getCurrentPlayer();
    if (currentPlayer?.playerId) {
      console.log("player found; get player");
      console.log(currentPlayer);
    } else {
      console.log("create new player");
      createPlayer("Sooraj");
    }
  }, []);
  return <div>Player's view</div>;
};

export { PlayerView };
