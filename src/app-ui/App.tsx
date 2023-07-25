import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Route, Routes } from "react-router-dom";
import { AppTabs } from "./AppTabs";
import { PlayerView } from "../player-view-ui/PlayerView";
import { Router } from "./Router";

const Players = () => {
  return <Typography>Players</Typography>;
};

const Rooms = () => {
  return <Typography>Rooms</Typography>;
};

const Games = () => {
  return <Typography>Games</Typography>;
};

const App = () => {
  return (
    <Router>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.grey[200],
          width: "100%",
          height: "inherit",
        }}
      >
        <AppTabs />
        <Routes>
          <Route path="players" element={<Players />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="games" element={<Games />} />
          <Route path="*" element={<PlayerView />} />
        </Routes>
      </Box>
    </Router>
  );
};

export { App };
