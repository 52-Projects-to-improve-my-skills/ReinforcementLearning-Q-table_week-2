// BoardOrquestator.js

import { drawBoard, drawSquare, clearSquare } from "./BoardRender.js";
import { hoveredCell, clickDetection, keyboardControls } from "./BoardInputs.js";
import { BOARD_STATES, STATE_COLOR, createBoardMatrix } from "./BoardStates.js";
import { forEachCell, isValidCell, updateUI } from "./utils/Utils.js";
import { Qtable } from "../agent/Qtable.js";
import { ACTIONS, REWARD, DELAY } from "./configs/Configs.js";

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

  const brain = new Qtable(totalHorizontalCells, totalVerticalCells, ACTIONS.length);
  let aiInterval = null;
  let episodes = 0;
  let successSteps = [];
  let episodeSteps = [];
  let currentEpisodeSteps = 0;

  // — Epsilon —
  document.getElementById("input-epsilon").oninput = (e) => {
    brain.epsilon = Math.min(1, Math.max(0, Number(e.target.value)));
  };

  document.getElementById("btn-start-ai").onclick = () => {
    if (aiInterval) {
      clearInterval(aiInterval);
      aiInterval = null;
      document.getElementById("btn-start-ai").textContent = "Iniciar IA";
    } else {
      const delay = Number(document.getElementById("input-delay").value) || DELAY;
      aiInterval = setInterval(startAI, delay);
      document.getElementById("btn-start-ai").textContent = "Detener IA";
    }
  };

  // — Guardar Q-Table —
  document.getElementById("btn-save").onclick = () => {
    const blob = new Blob([JSON.stringify(brain.table, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qtable.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // — Cargar Q-Table —
  document.getElementById("btn-load").onclick = () =>
    document.getElementById("input-load").click();

  document.getElementById("input-load").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        brain.table = JSON.parse(ev.target.result);
      } catch {
        console.error("Q-Table JSON inválido");
      }
    };
    reader.readAsText(file);
  };

  // ======================================//
  function startAI() {
    currentEpisodeSteps++;
    const currentState = { ...playerPos };

    const actionIndex = brain.chooseAction(currentState.x, currentState.y);
    const action = ACTIONS[actionIndex];

    const newX = currentState.x + action.x;
    const newY = currentState.y + action.y;

    let reward = REWARD.STEP;
    let nextState = { x: newX, y: newY };

    if (!isValidCell(newX, newY) || boardMatrix[newX][newY] === BOARD_STATES.states.DEAD_CELL) {
      reward = REWARD.DEATH;
      nextState = { ...startPoint };
      episodeSteps.push(currentEpisodeSteps);
      currentEpisodeSteps = 0;
      episodes++;
      if (isValidCell(newX, newY)) {
        movePlayer(newX, newY);
      } else {
        stats.deaths++;
        stats.steps = 0;
        playerPos = { ...startPoint };
        updateUI(stats.steps, stats.deaths);
        render();
      }
      updateMetrics();
      drawChart();
    } else if (boardMatrix[newX][newY] === BOARD_STATES.states.END_CELL) {
      reward = REWARD.GOAL;
      nextState = { ...startPoint };
      successSteps.push(currentEpisodeSteps);
      episodeSteps.push(currentEpisodeSteps);
      currentEpisodeSteps = 0;
      episodes++;
      movePlayer(newX, newY);
      updateMetrics();
      drawChart();
    } else {
      movePlayer(newX, newY);
    }

    brain.learn(currentState, actionIndex, reward, nextState);
  }

  function updateMetrics() {
    document.getElementById("stat-episodes").textContent = episodes;
    if (successSteps.length > 0) {
      document.getElementById("stat-min-steps").textContent = Math.min(...successSteps);
      const avg = successSteps.reduce((a, b) => a + b, 0) / successSteps.length;
      document.getElementById("stat-avg-steps").textContent = avg.toFixed(1);
    }
  }

  function drawChart() {
    const chartCanvas = document.getElementById("chart");
    if (!chartCanvas) return;
    const ctx = chartCanvas.getContext("2d");
    const W = chartCanvas.width;
    const H = chartCanvas.height;
    const PAD = { top: 28, right: 24, bottom: 40, left: 52 };
    const data = episodeSteps.slice(-300);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, W, H);

    if (data.length < 2) {
      ctx.fillStyle = "#888";
      ctx.font = "13px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Esperando datos de episodios...", W / 2, H / 2);
      return;
    }

    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const maxVal = Math.max(...data, 1);
    const toX = (i) => PAD.left + (i / (data.length - 1)) * innerW;
    const toY = (v) => PAD.top + innerH - (v / maxVal) * innerH;

    // Grid
    for (let i = 0; i <= 5; i++) {
      const y = PAD.top + (i / 5) * innerH;
      ctx.strokeStyle = "#2a2a4a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(W - PAD.right, y);
      ctx.stroke();
      ctx.fillStyle = "#666";
      ctx.font = "10px monospace";
      ctx.textAlign = "right";
      ctx.fillText(Math.round(maxVal * (1 - i / 5)), PAD.left - 6, y + 4);
    }

    // Ejes
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.left, PAD.top);
    ctx.lineTo(PAD.left, PAD.top + innerH);
    ctx.lineTo(W - PAD.right, PAD.top + innerH);
    ctx.stroke();

    // Etiqueta X
    ctx.fillStyle = "#888";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`Episodios (últimos ${data.length})`, W / 2, H - 8);

    // Línea de pasos por episodio
    ctx.strokeStyle = "rgba(80,160,255,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    data.forEach((v, i) =>
      i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v))
    );
    ctx.stroke();

    // Media móvil (ventana 20)
    const WIN = Math.min(20, Math.floor(data.length / 2));
    if (WIN >= 2) {
      ctx.strokeStyle = "#ffaa00";
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      for (let i = WIN - 1; i < data.length; i++) {
        const avg =
          data.slice(i - WIN + 1, i + 1).reduce((a, b) => a + b, 0) / WIN;
        if (!started) {
          ctx.moveTo(toX(i), toY(avg));
          started = true;
        } else {
          ctx.lineTo(toX(i), toY(avg));
        }
      }
      ctx.stroke();
    }

    // Línea del mínimo (solo episodios con meta alcanzada)
    if (successSteps.length > 0) {
      const best = Math.min(...successSteps);
      const bestY = toY(best);
      ctx.strokeStyle = "#55ff88";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(PAD.left, bestY);
      ctx.lineTo(W - PAD.right, bestY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#55ff88";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`mín: ${best}`, PAD.left + 4, bestY - 4);
    }

    // Leyenda
    [
      { color: "rgba(80,160,255,0.8)", label: "Pasos / ep." },
      { color: "#ffaa00",             label: `Media (${WIN})` },
      { color: "#55ff88",             label: "Mínimo (meta)" },
    ].forEach(({ color, label }, idx) => {
      const lx = PAD.left + 8 + idx * 150;
      const ly = PAD.top + 10;
      ctx.fillStyle = color;
      ctx.fillRect(lx, ly - 3, 14, 3);
      ctx.fillStyle = "#ccc";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(label, lx + 18, ly + 1);
    });
  }

  updateUI(stats.steps, stats.deaths);
  render();
  drawChart();
};
