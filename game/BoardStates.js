// BoardStates.js

export const BOARD_STATES = {
  states: {
    DEAD_CELL: 0,
    HOVERED_CELL: 1,
    PATH_CELL: 2,
    START_CELL: 3,
    END_CELL: 4,
    PLAYER_CELL: 5,
  },
};

export const STATE_COLOR = {
  [BOARD_STATES.states.DEAD_CELL]: "#333",
  [BOARD_STATES.states.HOVERED_CELL]: "#555",
  [BOARD_STATES.states.PATH_CELL]: "#FFF",
  [BOARD_STATES.states.START_CELL]: "#595",
  [BOARD_STATES.states.END_CELL]: "#FF5",
  [BOARD_STATES.states.PLAYER_CELL]: "#55F",
};

export function createBoardMatrix(width, height) {
  return new Array(height)
    .fill(null)
    .map(() => new Array(width).fill(BOARD_STATES.states.DEAD_CELL));
}
