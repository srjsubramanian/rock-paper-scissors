import { Box, CircularProgress, Typography } from "@mui/material";
import { CenteredCardContent, MainCard } from "../common-ui";

const CheckingForPlayer = () => {
  return (
    <MainCard>
      <CenteredCardContent>
        <Box padding={2}>
          <Typography>Checking for player</Typography>
        </Box>
        <CircularProgress />
      </CenteredCardContent>
    </MainCard>
  );
};

export { CheckingForPlayer };
