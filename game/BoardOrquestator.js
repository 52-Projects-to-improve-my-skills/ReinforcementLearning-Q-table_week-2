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
  const context = canvas.getContext("2d");
  const cellSize = canvas.width / totalHorizontalCells;
  let mode = "draw";
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
      playerCtrl.getPosition(),
      STATE_COLOR[BOARD_STATES.states.PLAYER_CELL],
    );
  }

  document.getElementById("btn-draw").onclick = () => (mode = "draw");
  document.getElementById("btn-erase").onclick = () => (mode = "erase");

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
    const stats = playerCtrl.getStats();
    updateUI(stats.steps, stats.deaths);
    render();
  });

  clickDetection(canvas, cellSize, (selected) => {
    if (
      (selected.x === 2 && selected.y === 9) ||
      (selected.x === 2 && selected.y === 0)
    )
      return;

    boardMatrix[selected.x][selected.y] =
      mode === "draw"
        ? BOARD_STATES.states.PATH_CELL
        : BOARD_STATES.states.DEAD_CELL;

    const stats = playerCtrl.getStats();
    updateUI(stats.steps, stats.deaths);
    render();
  });

  keyboardControls((direction) => {
    const pos = playerCtrl.getPosition();
    const newX = pos.x + direction.x;
    const newY = pos.y + direction.y;
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
