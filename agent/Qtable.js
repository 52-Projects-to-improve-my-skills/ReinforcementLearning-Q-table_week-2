export class Qtable {
  constructor(width, height, actions) {
    this.width = width;
    this.height = height;
    this.actions = actions;

    this.alpha = 0.1;
    this.gamma = 0.9;
    this.epsilon = 0.1;

    this.table = {};
    this.init();
  }

  init() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.table[`${x},${y}`] = new Array(this.actions).fill(0);
      }
    }
  }

  chooseAction(x, y) {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.actions);
    } else {
      const qValues = this.getQValues(x, y);
      const maxQ = Math.max(...qValues);
      const bestActions = qValues
        .map((q, index) => (q === maxQ ? index : -1))
        .filter((index) => index !== -1);
      return bestActions[Math.floor(Math.random() * bestActions.length)];
    }
  }

  learn(state, action, reward, nextState) {
    const currentQ = this.table[`${state.x},${state.y}`][action];

    const nextQValues = this.table[`${nextState.x},${nextState.y}`];
    const maxNextQ = Math.max(...nextQValues);

    const newValue =
      currentQ + this.alpha * (reward + this.gamma * maxNextQ - currentQ);

    this.updateQValue(state.x, state.y, action, newValue);
  }

  getQValues(x, y) {
    return this.table[`${x},${y}`] || new Array(this.actions).fill(0);
  }

  updateQValue(x, y, action, value) {
    this.table[`${x},${y}`][action] = value;
  }
}
