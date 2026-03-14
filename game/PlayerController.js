// PlayerController.js

import { BOARD_STATES } from "./BoardStates.js";

export function createPlayerController({ boardMatrix, startPoint }) {
  let playerPosition = { ...startPoint };
  let stats = { steps: 0, deaths: 0 };

  function movePlayer(targetX, targetY) {
    const targetState = boardMatrix[targetX][targetY];

    if (targetState === BOARD_STATES.states.DEAD_CELL) {
      stats.deaths++;
      playerPosition = { ...startPoint };
      stats.steps = 0;
    } else if (targetState === BOARD_STATES.states.END_CELL) {
      playerPosition = { ...startPoint };
      stats.steps = 0;
    } else {
      playerPosition = { x: targetX, y: targetY };
      stats.steps++;
    }
  }

  function resetToStart() {
    playerPosition = { ...startPoint };
    stats.steps = 0;
  }

  function getPosition() {
    return { ...playerPosition };
  }

  function getStats() {
    return { ...stats };
  }

  return { movePlayer, resetToStart, getPosition, getStats };
}
