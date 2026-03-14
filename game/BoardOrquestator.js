// BoardOrquestator.js

import { drawBoard, drawSquare, clearSquare } from "./BoardRender.js";
import { hoveredCell, clickDetection, keyboardControls } from "./BoardInputs.js";
import { BOARD_STATES, STATE_COLOR, createBoardMatrix } from "./BoardStates.js";

import { forEachCell, isValidCell, updateUI } from "./utils/Utils.js";

window.totalHorizontalCells = 5;
window.totalVerticalCells = 10;

window.onload = function () {
  const canvas = document.getElementById("board");
  const context = canvas.getContext("2d");
  const cellSize = canvas.width / totalHorizontalCells;
  let mode = "draw";
  const startPoint = { x: 2, y: 9 };
  const endPoint = { x: 2, y: 0 };
  let playerPos = { ...startPoint };
  let stats = { steps: 0, deaths: 0 };

  const boardMatrix = createBoardMatrix(
    totalVerticalCells,
    totalHorizontalCells,
  );

  boardMatrix[2][9] = BOARD_STATES.states.START_CELL;
  boardMatrix[2][0] = BOARD_STATES.states.END_CELL;

  document.getElementById("btn-draw").onclick = () => (mode = "draw");
  document.getElementById("btn-erase").onclick = () => (mode = "erase");

  function movePlayer(newX, newY) {
    const targetState = boardMatrix[newX][newY];

    if (targetState === BOARD_STATES.states.DEAD_CELL) {
      stats.deaths++;
      playerPos = { ...startPoint };
      stats.steps = 0;
    } else if (targetState === BOARD_STATES.states.END_CELL) {
      console.log("¡Llegó a la meta!");
      playerPos = { ...startPoint };
      stats.steps = 0;
    } else {
      playerPos = { x: newX, y: newY };
      stats.steps++;
    }
    updateUI(stats.steps, stats.deaths);
    render();
  }

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard(context, canvas);

    forEachCell((x, y) => {
      const cellState = boardMatrix[x][y];
      if (cellState !== BOARD_STATES.states.DEAD_CELL) {
        drawSquare(context, cellSize, { x, y }, STATE_COLOR[cellState]);
      }
    });
    drawSquare(
      context,
      cellSize,
      playerPos,
      STATE_COLOR[BOARD_STATES.states.PLAYER_CELL],
    );
  }

  hoveredCell(canvas, cellSize, (hovered) => {
    forEachCell((x, y) => {
      if (boardMatrix[x][y] === BOARD_STATES.states.HOVERED_CELL) {
        boardMatrix[x][y] = BOARD_STATES.states.DEAD_CELL;
      }
    });

    if (isValidCell(hovered.x, hovered.y)) {
      if (boardMatrix[hovered.x][hovered.y] === BOARD_STATES.states.DEAD_CELL) {
        boardMatrix[hovered.x][hovered.y] = BOARD_STATES.states.HOVERED_CELL;
      }
    }
    updateUI(stats.steps, stats.deaths);
    render();
  });

  clickDetection(canvas, cellSize, (selected) => {
    if (
      (selected.x === 2 && selected.y === 9) ||
      (selected.x === 2 && selected.y === 0)
    )
      return;

    if (mode === "draw") {
      boardMatrix[selected.x][selected.y] = BOARD_STATES.states.PATH_CELL;
    } else {
      boardMatrix[selected.x][selected.y] = BOARD_STATES.states.DEAD_CELL;
    }
    updateUI(stats.steps, stats.deaths);
    render();
  });

  keyboardControls((direction) => {
    const newX = playerPos.x + direction.x;
    const newY = playerPos.y + direction.y;
    if (isValidCell(newX, newY)) {
      movePlayer(newX, newY);
    }
  });

  updateUI(stats.steps, stats.deaths);
  render();
};
