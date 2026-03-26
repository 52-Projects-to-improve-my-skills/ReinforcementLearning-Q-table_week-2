# 🤖 Reinforcement Learning with Q-Table

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Online-brightgreen?logo=githubpages&logoColor=brightgreen)](https://52-projects-to-improve-my-skills.github.io/ReinforcementLearning-Q-table_week-2/)

**Read in [Español](README_ES.md)**

## 📌 Executive Summary

An interactive web application that implements a Q-Learning agent to navigate a 2D board. The project demonstrates the Bellman update, the exploration–exploitation tradeoff, and a clear separation between the learning algorithm (Q-Table) and the visualization layer.

Part of: 52 Projects Challenge — Week 2

---

## 🚀 Quick Start (5 Minutes)

1. Clone the repository and open `index.html` in a modern browser (no build required).
2. Important: the board starts blocked (all cells are walls). In the left UI click the `Pintar Path` button to select paint mode, then click+drag on the board to create walkable cells (PATH) between the start and the goal.
3. Set `Epsilon (ε)` and `Delay` in the UI; click `Iniciar IA` to start training.
4. Use `Guardar Q-Table` to download `qtable.json` and `Cargar Q-Table` to restore a saved table.

Expected result: after ~50–100 episodes the steps/episode should decrease as the agent learns.

---

## 📚 Fundamental Concepts (brief)

- Reinforcement Learning: agent learns a policy by interacting with an environment and receiving rewards.
- Components:
  - Agent: controller using the Q-Table.
  - Environment: 5×10 grid with start and goal.
  - Actions: Up / Down / Left / Right (see `game/configs/Configs.js`).
  - Rewards: +20 (goal), -1 (step), -10 (death/hit wall).

---

## 🧠 Q-Learning (Theory + Practical)

Bellman update (core):

$$Q(s,a) \leftarrow Q(s,a) + \alpha \left[r + \gamma \max_{a'} Q(s',a') - Q(s,a)\right]$$

Plain: Q_new = Q + alpha * (reward + gamma * max(nextQ) - Q)

Exploration–exploitation (epsilon-greedy): the instance property `q.epsilon` controls exploration probability.

---

## 🏗️ Architecture (short)

- Entry: `index.html`
- Main orchestrator: `game/BoardOrquestator.js`
- Core algorithm: `agent/Qtable.js`
- Controller: `game/AIController.js` (train loop, save/load)
- Rendering: `game/BoardRender.js`, `game/ChartRenderer.js`
- Configs: `game/configs/Configs.js` (`ACTIONS`, `REWARD`, `DELAY`)

Data flow: UI → BoardOrquestator → AIController → Qtable → Board state → Renderer/Chart

---

## 🎮 User Guide (controls & editing)

- Editing mode is selected with GUI buttons:
  - `Pintar Path` (`btn-draw`) — selects paint mode.
  - `Borrar Path` (`btn-erase`) — selects erase mode.
  - After selecting a tool, use click+drag on the canvas to paint or erase cells.
- Start / Stop training: `Iniciar IA` / same button toggles (`btn-start-ai`).
- Save / Load Q-Table: `Guardar Q-Table` (`btn-save`) / `Cargar Q-Table` (`btn-load`).
- Epsilon is live-editable via the `input-epsilon` input; you can also set `brain.epsilon` programmatically.

Important: because the board initially contains walls, paint at least one path from start to goal before training to observe meaningful learning.

---

## 🔧 API (actual signatures)

- Qtable constructor:
```javascript
new Qtable(boardWidth, boardHeight, actionsCount)
```
Example:
```javascript
const q = new Qtable(5, 10, ACTIONS.length); // ACTIONS.length === 4
q.epsilon = 0.1;
```

- chooseAction:
```javascript
q.chooseAction(stateX, stateY) // returns action index 0..(actionsCount-1)
```

- learn:
```javascript
q.learn({x, y}, actionIndex, reward, nextState)
```

Save/load functions are provided by `AIController`:
- `aiCtrl.saveQTable()` downloads `qtable.json`
- `aiCtrl.loadQTable(file)` loads a JSON file (returns a Promise)

---

## ❓ Troubleshooting (important notes)

- If the agent "dies" immediately or episodes end instantly: the board likely has no PATH cells. Paint a path from start to goal before training.
- If agent never improves:
  - Check `q.epsilon` (not 1.0), `alpha > 0`, and reward signs.
  - Try resetting Q-Table and lowering epsilon for exploitation.
- Save/Load: ensure JSON structure matches the saved `qtable.json` (use the project's save button to generate compatible JSON).

---

## 🎓 Author & License

- Carlos Enrique Cochero Ramos — GitHub: @caertos  
- License: MIT (`LICENSE`)

---

## 🔗 Resources

- Sutton & Barto — Reinforcement Learning: An Introduction  
- Watkins & Dayan (Q-Learning)  
- Canvas API (MDN)

