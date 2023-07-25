import { CardHeader } from "@mui/material";
import { MainCard } from "../common-ui";

const Player = ({ playerId, name }: { playerId: string; name: string }) => {
  return (
    <MainCard>
      <CardHeader title={`Hi ${name}`} />
    </MainCard>
  );
};

export { Player };
