export class Qtable {
  constructor(boardWidth, boardHeight, actions) {
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.actions = actions;

    this.alpha = 0.1;
    this.gamma = 0.9;
    this.epsilon = 0.1;

    this.qTable = {};
    this.init();
  }

  init() {
    for (let stateX = 0; stateX < this.boardWidth; stateX++) {
      for (let stateY = 0; stateY < this.boardHeight; stateY++) {
        this.qTable[`${stateX},${stateY}`] = new Array(this.actions).fill(0);
      }
    }
  }

  chooseAction(stateX, stateY) {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.actions);
    } else {
      const qValues = this.getQValues(stateX, stateY);
      const maxQValue = Math.max(...qValues);
      const bestActions = qValues
        .map((qValue, index) => (qValue === maxQValue ? index : -1))
        .filter((index) => index !== -1);
      return bestActions[Math.floor(Math.random() * bestActions.length)];
    }
  }

  learn(state, action, reward, nextState) {
    const currentQValue = this.qTable[`${state.x},${state.y}`][action];

    const nextQValues = this.qTable[`${nextState.x},${nextState.y}`];
    const maxNextQValue = Math.max(...nextQValues);

    const updatedQValue =
      currentQValue + this.alpha * (reward + this.gamma * maxNextQValue - currentQValue);

    this.updateQValue(state.x, state.y, action, updatedQValue);
  }

  getQValues(stateX, stateY) {
    return this.qTable[`${stateX},${stateY}`] || new Array(this.actions).fill(0);
  }

  updateQValue(stateX, stateY, action, value) {
    this.qTable[`${stateX},${stateY}`][action] = value;
  }
}
