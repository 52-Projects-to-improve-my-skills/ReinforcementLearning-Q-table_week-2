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

    const nextPositionX = currentState.x + action.x;
    const nextPositionY = currentState.y + action.y;

    let reward = REWARD.STEP;
    let nextState = { x: nextPositionX, y: nextPositionY };

    if (
      !isValidCell(nextPositionX, nextPositionY) ||
      boardMatrix[nextPositionX][nextPositionY] === BOARD_STATES.states.DEAD_CELL
    ) {
      reward = REWARD.DEATH;
      nextState = { ...startPoint };
      episodeSteps.push(currentEpisodeSteps);
      currentEpisodeSteps = 0;
      episodes++;

      if (isValidCell(nextPositionX, nextPositionY)) {
        playerCtrl.movePlayer(nextPositionX, nextPositionY);
      } else {
        playerCtrl.resetToStart();
      }
      onRender();
      onEpisodeEnd({ episodes, successSteps: [...successSteps], episodeSteps: [...episodeSteps] });
    } else if (boardMatrix[nextPositionX][nextPositionY] === BOARD_STATES.states.END_CELL) {
      reward = REWARD.GOAL;
      nextState = { ...startPoint };
      successSteps.push(currentEpisodeSteps);
      episodeSteps.push(currentEpisodeSteps);
      currentEpisodeSteps = 0;
      episodes++;
      playerCtrl.movePlayer(nextPositionX, nextPositionY);
      onRender();
      onEpisodeEnd({ episodes, successSteps: [...successSteps], episodeSteps: [...episodeSteps] });
    } else {
      playerCtrl.movePlayer(nextPositionX, nextPositionY);
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
    const blob = new Blob([JSON.stringify(brain.qTable, null, 2)], {
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
          brain.qTable = JSON.parse(ev.target.result);
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
