import { MemoryRouter } from "react-router";

const Router = (props: { children?: React.ReactNode }) => {
  const { children } = props;
  return (
    <MemoryRouter initialEntries={["/play_game"]} initialIndex={0}>
      {children}
    </MemoryRouter>
  );
};
export { Router };
