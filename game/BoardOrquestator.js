// BoardOrquestator.js

import { drawBoard, drawSquare } from "./BoardRender.js";
import { hoveredCell, clickDetection, keyboardControls } from "./BoardInputs.js";
import { BOARD_STATES, STATE_COLOR, createBoardMatrix } from "./BoardStates.js";
import { forEachCell, isValidCell, updateUI } from "./utils/Utils.js";
import { Qtable } from "../agent/Qtable.js";
import { ACTIONS, REWARD, DELAY } from "./configs/Configs.js";
import { createPlayerController } from "./PlayerController.js";
import { createAIController } from "./AIController.js";
import { drawChart } from "./ChartRenderer.js";

window.totalHorizontalCells = 5;
window.totalVerticalCells = 10;

window.onload = function () {
  const canvas = document.getElementById("board");
  const canvasContext = canvas.getContext("2d");
  const cellSize = canvas.width / totalHorizontalCells;
  let editMode = "draw";
  const startPoint = { x: 2, y: 9 };

  const boardMatrix = createBoardMatrix(totalVerticalCells, totalHorizontalCells);
  boardMatrix[2][9] = BOARD_STATES.states.START_CELL;
  boardMatrix[2][0] = BOARD_STATES.states.END_CELL;

  const playerCtrl = createPlayerController({ boardMatrix, startPoint });
  const brain = new Qtable(totalHorizontalCells, totalVerticalCells, ACTIONS.length);

  const aiCtrl = createAIController({
    brain,
    boardMatrix,
    BOARD_STATES,
    isValidCell,
    startPoint,
    playerCtrl,
    ACTIONS,
    REWARD,
    onRender() {
      const stats = playerCtrl.getStats();
      updateUI(stats.steps, stats.deaths);
      render();
    },
    onEpisodeEnd({ episodes, successSteps, episodeSteps }) {
      document.getElementById("stat-episodes").textContent = episodes;
      if (successSteps.length > 0) {
        document.getElementById("stat-min-steps").textContent = Math.min(...successSteps);
        const avg = successSteps.reduce((a, b) => a + b, 0) / successSteps.length;
        document.getElementById("stat-avg-steps").textContent = avg.toFixed(1);
      }
      drawChart(episodeSteps, successSteps);
    },
  });

  function render() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard(canvasContext, canvas);

    forEachCell((cellX, cellY) => {
      const cellState = boardMatrix[cellX][cellY];
      if (cellState !== BOARD_STATES.states.DEAD_CELL) {
        drawSquare(canvasContext, cellSize, { x: cellX, y: cellY }, STATE_COLOR[cellState]);
      }
    });
    drawSquare(
      canvasContext,
      cellSize,
      playerCtrl.getPosition(),
      STATE_COLOR[BOARD_STATES.states.PLAYER_CELL],
    );
  }

  document.getElementById("btn-draw").onclick = () => (editMode = "draw");
  document.getElementById("btn-erase").onclick = () => (editMode = "erase");

  hoveredCell(canvas, cellSize, (hoveredCellCoords) => {
    forEachCell((cellX, cellY) => {
      if (boardMatrix[cellX][cellY] === BOARD_STATES.states.HOVERED_CELL) {
        boardMatrix[cellX][cellY] = BOARD_STATES.states.DEAD_CELL;
      }
    });
    if (isValidCell(hoveredCellCoords.x, hoveredCellCoords.y)) {
      if (boardMatrix[hoveredCellCoords.x][hoveredCellCoords.y] === BOARD_STATES.states.DEAD_CELL) {
        boardMatrix[hoveredCellCoords.x][hoveredCellCoords.y] = BOARD_STATES.states.HOVERED_CELL;
      }
    }
    const stats = playerCtrl.getStats();
    updateUI(stats.steps, stats.deaths);
    render();
  });

  clickDetection(canvas, cellSize, (selectedCellCoords) => {
    if (
      (selectedCellCoords.x === 2 && selectedCellCoords.y === 9) ||
      (selectedCellCoords.x === 2 && selectedCellCoords.y === 0)
    )
      return;

    boardMatrix[selectedCellCoords.x][selectedCellCoords.y] =
      editMode === "draw"
        ? BOARD_STATES.states.PATH_CELL
        : BOARD_STATES.states.DEAD_CELL;

    const stats = playerCtrl.getStats();
    updateUI(stats.steps, stats.deaths);
    render();
  });

  keyboardControls((direction) => {
    const currentPlayerPosition = playerCtrl.getPosition();
    const newX = currentPlayerPosition.x + direction.x;
    const newY = currentPlayerPosition.y + direction.y;
    if (isValidCell(newX, newY)) {
      playerCtrl.movePlayer(newX, newY);
      const stats = playerCtrl.getStats();
      updateUI(stats.steps, stats.deaths);
      render();
    }
  });

  document.getElementById("input-epsilon").oninput = (e) => {
    brain.epsilon = Math.min(1, Math.max(0, Number(e.target.value)));
  };

  document.getElementById("btn-start-ai").onclick = () => {
    if (aiCtrl.isRunning()) {
      aiCtrl.stop();
      document.getElementById("btn-start-ai").textContent = "Iniciar IA";
    } else {
      const delay = Number(document.getElementById("input-delay").value) || DELAY;
      aiCtrl.start(delay);
      document.getElementById("btn-start-ai").textContent = "Detener IA";
    }
  };

  document.getElementById("btn-save").onclick = () => aiCtrl.saveQTable();

  document.getElementById("btn-load").onclick = () =>
    document.getElementById("input-load").click();

  document.getElementById("input-load").onchange = (e) => {
    const file = e.target.files[0];
    if (file) aiCtrl.loadQTable(file);
  };

  const stats = playerCtrl.getStats();
  updateUI(stats.steps, stats.deaths);
  render();
  drawChart([], []);
};
