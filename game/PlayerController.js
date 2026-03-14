// PlayerController.js

import { BOARD_STATES } from "./BoardStates.js";

export function createPlayerController({ boardMatrix, startPoint }) {
  let playerPos = { ...startPoint };
  let stats = { steps: 0, deaths: 0 };

  function movePlayer(newX, newY) {
    const targetState = boardMatrix[newX][newY];

    if (targetState === BOARD_STATES.states.DEAD_CELL) {
      stats.deaths++;
      playerPos = { ...startPoint };
      stats.steps = 0;
    } else if (targetState === BOARD_STATES.states.END_CELL) {
      playerPos = { ...startPoint };
      stats.steps = 0;
    } else {
      playerPos = { x: newX, y: newY };
      stats.steps++;
    }
  }

  function resetToStart() {
    playerPos = { ...startPoint };
    stats.steps = 0;
  }

  function getPosition() {
    return { ...playerPos };
  }

  function getStats() {
    return { ...stats };
  }

  return { movePlayer, resetToStart, getPosition, getStats };
}
