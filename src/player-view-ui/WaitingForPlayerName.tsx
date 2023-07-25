import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { MainCard } from "../common-ui";

const WaitingForPlayerName = ({
  onNameInput,
}: {
  onNameInput: (name: string) => void;
}) => {
  const [input, setInput] = useState("");
  const canLogin = input.length > 0;
  return (
    <MainCard>
      <CardContent
        sx={(theme) => ({
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
        })}
      >
        <Typography variant="overline">Introduce yourself</Typography>
        <Typography variant="h5">What's your name?</Typography>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          marginTop={4}
        >
          <Box>
            <TextField
              id="player-name-input"
              label="Player Name"
              variant="standard"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
            />
          </Box>
          <Box>
            <Button
              size="medium"
              endIcon={<SendIcon />}
              disabled={!canLogin}
              onClick={() => onNameInput(input)}
            >
              Login
            </Button>
          </Box>
        </Box>
      </CardContent>
    </MainCard>
  );
};

export { WaitingForPlayerName };
