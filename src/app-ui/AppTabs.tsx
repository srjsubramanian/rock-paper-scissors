import { Tabs, Tab } from "@mui/material";
import { Link } from "react-router-dom";
import { useRouteMatch } from "../common-hooks/useRouteMatch";

const AppTabs = () => {
  const routeMatch = useRouteMatch([
    "/play_game",
    "/players",
    "/rooms",
    "/games",
  ]);
  const currentTab = routeMatch?.pattern?.path;

  return (
    <Tabs value={currentTab}>
      <Tab label="Play" value="/play_game" to="/play_game" component={Link} />
      <Tab label="Players" value="/players" to="/players" component={Link} />
      <Tab label="Rooms" value="/rooms" to="/rooms" component={Link} />
      <Tab label="Games" value="/games" to="/games" component={Link} />
    </Tabs>
  );
};

export { AppTabs };
