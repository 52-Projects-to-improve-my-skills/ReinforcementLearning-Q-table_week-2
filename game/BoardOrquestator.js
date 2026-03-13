// BoardOrquestator.js

import { drawBoard, drawSquare, clearSquare } from "./BoardRender.js";
import { hoveredCell, clickDetection } from "./BoardInputs.js";
import { BOARD_STATES, STATE_COLOR, createBoardMatrix } from "./BoardStates.js";

import { forEachCell, isValidCell } from "./utils/Utils.js";

window.totalHorizontalCells = 5;
window.totalVerticalCells = 10;

window.onload = function () {
  const canvas = document.getElementById("board");
  const context = canvas.getContext("2d");
  const cellSize = canvas.width / totalHorizontalCells;
  let mode = "draw";
  let startPoint = { x: 9, y: 2 };
  let endPoint = { x: 0, y: 2 };
  let stats = { steps: 0, deaths: 0 };

  const boardMatrix = createBoardMatrix(
    totalVerticalCells,
    totalHorizontalCells,
  );

  boardMatrix[2][9] = BOARD_STATES.states.START_CELL;
  boardMatrix[2][0] = BOARD_STATES.states.END_CELL;

  document.getElementById("btn-draw").onclick = () => (mode = "draw");
  document.getElementById("btn-erase").onclick = () => (mode = "erase");

  clickDetection(canvas, cellSize, (selected) => {
    if ((selected.x === 9 && selected.y === 2) || (selected.x === 0 && selected.y === 2)) return;

    if (mode === 'draw') {
        boardMatrix[selected.x][selected.y] = BOARD_STATES.states.PATH_CELL;
    } else {
        boardMatrix[selected.x][selected.y] = BOARD_STATES.states.DEAD_CELL;
    }
    render();
});



  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard(context, canvas);

    forEachCell((x, y) => {
      const cellState = boardMatrix[x][y];
      if (cellState !== BOARD_STATES.states.DEAD_CELL) {
        drawSquare(context, cellSize, { x, y }, STATE_COLOR[cellState]);
      }
    });
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
    render();
  });

  clickDetection(canvas, cellSize, (selected) => {
    if (isValidCell(selected.x, selected.y)) {
      if (
        boardMatrix[selected.x][selected.y] === BOARD_STATES.states.HOVERED_CELL
      ) {
        boardMatrix[selected.x][selected.y] = BOARD_STATES.states.PATH_CELL;
      }
    }

    render();
  });
  render();
};
