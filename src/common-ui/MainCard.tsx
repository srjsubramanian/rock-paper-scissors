import { Card, CardProps } from "@mui/material";
import { Flipped } from "react-flip-toolkit";

const MainCard = (props: CardProps) => {
  return (
    <Flipped flipId="MAIN_CARD">
      <Card {...props} sx={{ ...props.sx, minWidth: 350 }} />
    </Flipped>
  );
};

export { MainCard };
