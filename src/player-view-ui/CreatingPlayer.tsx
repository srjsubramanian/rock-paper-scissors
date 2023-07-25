import { Box, CircularProgress, Typography } from "@mui/material";
import { CenteredCardContent, MainCard } from "../common-ui";

const CreatingPlayer = () => {
  return (
    <MainCard>
      <CenteredCardContent>
        <CircularProgress />
        <Box padding={2}>
          <Typography>Creating Player</Typography>
        </Box>
      </CenteredCardContent>
    </MainCard>
  );
};

export { CreatingPlayer };
