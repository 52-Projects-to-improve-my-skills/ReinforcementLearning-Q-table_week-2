// AIController.js

export function createAIController({
  brain,
  boardMatrix,
  BOARD_STATES,
  isValidCell,
  startPoint,
  playerCtrl,
  ACTIONS,
  REWARD,
  onRender,
  onEpisodeEnd,
}) {
  let aiInterval = null;
  let episodes = 0;
  let successSteps = [];
  let episodeSteps = [];
  let currentEpisodeSteps = 0;

  function step() {
    currentEpisodeSteps++;
    const currentState = playerCtrl.getPosition();

    const actionIndex = brain.chooseAction(currentState.x, currentState.y);
    const action = ACTIONS[actionIndex];

    const newX = currentState.x + action.x;
    const newY = currentState.y + action.y;

    let reward = REWARD.STEP;
    let nextState = { x: newX, y: newY };

    if (
      !isValidCell(newX, newY) ||
      boardMatrix[newX][newY] === BOARD_STATES.states.DEAD_CELL
    ) {
      reward = REWARD.DEATH;
      nextState = { ...startPoint };
      episodeSteps.push(currentEpisodeSteps);
      currentEpisodeSteps = 0;
      episodes++;

      if (isValidCell(newX, newY)) {
        playerCtrl.movePlayer(newX, newY);
      } else {
        playerCtrl.resetToStart();
      }
      onRender();
      onEpisodeEnd({ episodes, successSteps: [...successSteps], episodeSteps: [...episodeSteps] });
    } else if (boardMatrix[newX][newY] === BOARD_STATES.states.END_CELL) {
      reward = REWARD.GOAL;
      nextState = { ...startPoint };
      successSteps.push(currentEpisodeSteps);
      episodeSteps.push(currentEpisodeSteps);
      currentEpisodeSteps = 0;
      episodes++;
      playerCtrl.movePlayer(newX, newY);
      onRender();
      onEpisodeEnd({ episodes, successSteps: [...successSteps], episodeSteps: [...episodeSteps] });
    } else {
      playerCtrl.movePlayer(newX, newY);
      onRender();
    }

    brain.learn(currentState, actionIndex, reward, nextState);
  }

  function start(delay) {
    if (aiInterval) return;
    aiInterval = setInterval(step, delay);
  }

  function stop() {
    if (!aiInterval) return;
    clearInterval(aiInterval);
    aiInterval = null;
  }

  function isRunning() {
    return aiInterval !== null;
  }

  function saveQTable() {
    const blob = new Blob([JSON.stringify(brain.table, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qtable.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function loadQTable(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          brain.table = JSON.parse(ev.target.result);
          resolve();
        } catch {
          console.error("Q-Table JSON inválido");
          reject();
        }
      };
      reader.readAsText(file);
    });
  }

  return { start, stop, isRunning, saveQTable, loadQTable };
}
