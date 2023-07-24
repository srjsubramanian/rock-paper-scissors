import { Input, PlayerInputs, Player } from "./game-types";

const STRONGER_OPTION = {
  [Input.Rock]: Input.Paper,
  [Input.Paper]: Input.Scissors,
  [Input.Scissors]: Input.Rock,
};

export const findWinner = ({
  player_1: player1Input,
  player_2: player2Input,
}: Partial<PlayerInputs> = {}): Player | undefined => {
  if (player1Input === player2Input) {
    return;
  }
  if (!player2Input || player1Input === STRONGER_OPTION[player2Input]) {
    return Player.Player1;
  }
  if (!player1Input) {
    return Player.Player2;
  }
  return Player.Player2;
};
