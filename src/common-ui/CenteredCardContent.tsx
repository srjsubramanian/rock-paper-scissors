import { CardContent, CardContentProps } from "@mui/material";

const CenteredCardContent = (props: CardContentProps) => {
  return (
    <CardContent
      {...props}
      sx={{
        ...props.sx,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};

export { CenteredCardContent };
