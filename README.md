# 🤖 Reinforcement Learning with Q-Table

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Online-brightgreen?logo=githubpages&logoColor=brightgreen)](https://52-projects-to-improve-my-skills.github.io/ReinforcementLearning-Q-table-/)

**Read in [Español](README_ES.md)**

---

## 📌 Executive Summary

A **interactive web application** that implements a Reinforcement Learning (RL) agent using the **Q-Learning algorithm** to autonomously navigate a 2D board. The agent starts with no knowledge and gradually learns optimal paths through trial-and-error, updating a Q-Table based on rewards and penalties.

**Key Academic Context**: This project demonstrates hands-on implementation of fundamental RL concepts including the Bellman equation, exploration-exploitation tradeoff, and the separation of concerns between the learning algorithm and visualization layer.

**Part of**: 52 Projects Challenge - Week 2

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Open in Browser
1. Clone or download this repository
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge)
3. No build tools or installation required ✨

### Step 2: Observe Initial State
```
┌─────────────────────────────────────────┐
│  Agent Position:  (2, 9) [Green Tile]  │
│  Goal Position:   (2, 0) [Yellow Tile] │
│  Board Size:      5 cols × 10 rows     │
│  Q-Table:         Empty (0s)           │
└─────────────────────────────────────────┘
```

### Step 3: Start Training
- Click the **"Start Training"** button
- Watch the agent move randomly (exploration phase)
- Monitor the **Performance Chart** updating in real-time
- After ~50-100 episodes, observe the agent finding better paths

### Step 4: Interact (Optional)
- **Draw walls**: Click+drag on the board with your mouse
- **Erase walls**: Right-click+drag to clear
- **Adjust epsilon** (exploration): Input value 0-1 (higher = more random)
- **Adjust delay**: Control speed of agent movement

### Expected Result After 100 Episodes
```
Chart shows:
├─ Blue line (steps/episode) dropping from ~30 down to ~5-7
└─ Orange line (moving average) showing downward trend → learning success!
```

---

## 📚 Fundamental Concepts: Reinforcement Learning 101

### What is Reinforcement Learning?

**Definition**: Machine learning paradigm where an **agent** learns to maximize cumulative rewards by interacting with an **environment** through trial-and-error, without being explicitly programmed.

**Key Components**:

| Component | Definition | In This Project |
|-----------|-----------|-----------------|
| **Agent** | Entity that learns | Our AI controller navigating the board |
| **Environment** | System agent interacts with | The 2D board with walls & goal |
| **State (s)** | Current situation | Agent's position (x, y) |
| **Action (a)** | Choice agent can make | Up, Down, Left, Right movement |
| **Reward (r)** | Feedback signal | +20 (goal), -1 (step), -10 (wall) |
| **Policy (π)** | Decision rule | Mechanism to choose actions |

### How RL Differs From Other ML Paradigms

```
┌──────────────────────────────────────────────────────────┐
│  LEARNING PARADIGM COMPARISON                            │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  🔵 SUPERVISED Learning                                 │
│     Input: Training data with labels                     │
│     Goal: Learn mapping f(x) → y                        │
│     Example: Image classification, spam detection        │
│                                                           │
│  🟣 UNSUPERVISED Learning                               │
│     Input: Unlabeled data only                          │
│     Goal: Find hidden patterns/clusters                  │
│     Example: Customer segmentation, compression          │
│                                                           │
│  🟢 REINFORCEMENT Learning (This Project)               │
│     Input: Sequence of states, actions, rewards         │
│     Goal: Learn policy to maximize total reward         │
│     Example: Game AI, robotics, navigation              │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🧠 Q-Learning: The Theory Behind the Code

### The Bellman Equation (Core Formula)

The heart of Q-Learning is the **Bellman Optimality Equation**:

$$Q(s, a) \leftarrow Q(s, a) + \alpha \left[ r + \gamma \max_{a'} Q(s', a') - Q(s, a) \right]$$

**Breaking it down**:

| Symbol | Name | Meaning | Intuition |
|--------|------|---------|-----------|
| $Q(s,a)$ | Q-Value | Estimated reward for taking action $a$ in state $s$ | "How good is this move?" |
| $\alpha$ | Learning Rate | How much to trust new information (0-1) | Low = slow learning, High = fast but unstable |
| $r$ | Reward | Immediate feedback from environment | +20 goal, -1 step cost, -10 wall penalty |
| $\gamma$ | Discount Factor | Weight of future vs immediate rewards (0-1) | Low = focus on immediate, High = plan ahead |
| $\max_{a'} Q(s', a')$ | Best future value | Maximum Q-value in the next state | "What's the best we can do from here?" |

### Step-by-Step Learning Process

```
EPISODE 1 (Agent has no knowledge yet):
─────────────────────────────────────────

1️⃣ STATE: Agent at (2, 9)
   └─ Q-Table: Q[(2,9)] = [0, 0, 0, 0] (no preference)

2️⃣ ACTION: Choose randomly (high epsilon) 
   └─ Chooses: UP (exploration)

3️⃣ ENVIRONMENT: Agent moves to (2, 8)
   └─ Reward: r = -1 (cost of taking a step)
   └─ Not at goal yet

4️⃣ UPDATE Q-VALUE (using Bellman):
   
   Before: Q(s=(2,9), a=UP) = 0
   
   Q_new = 0 + 0.1 × [ -1 + 0.9 × max(Q[(2,8)]) - 0 ]
   Q_new = 0 + 0.1 × [ -1 + 0 - 0 ]
   Q_new = -0.1
   
   After: Q(s=(2,9), a=UP) = -0.1 ✓ (slightly negative = not ideal)

5️⃣ REPEAT: Continue for many episodes...
```

### Exploration vs Exploitation (ε-Greedy Strategy)

**The Dilemma**:
- ❌ **Pure Exploitation**: Always pick best-known move → stuck in local optimum
- ❌ **Pure Exploration**: Always random move → never uses knowledge
- ✅ **ε-Greedy (Balanced)**:
  - With probability $\epsilon$: Pick random action (explore)
  - With probability $1-\epsilon$: Pick best action (exploit)

**In This Project**:
```
if Math.random() < EPSILON:
    action = chooseRandomAction()  // Explore: 10% chance
else:
    action = chooseBestAction()    // Exploit: 90% chance
```

---

## 🏗️ System Architecture & Modular Design

### High-Level Module Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    index.html (Entry Point)                 │
│              [Buttons, Stats, Chart Container]              │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         ▼                                 ▼
    ┌─────────────┐              ┌──────────────────┐
    │ BoardInputs │              │  BoardOrquestrator│
    │ (Keyboard,  │◄─────────────│   [Main Loop]    │
    │  Mouse)     │              │                  │
    └─────────────┘              └────────┬─────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
              ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
              │   Qtable.js  │    │AIController  │    │BoardRender.js    │
              │ [Core RL]    │    │ [Training]   │    │ [Visualization]  │
              │              │    │              │    │                  │
              │ - init()     │    │ - train()    │    │ - drawGrid()     │
              │ - learn()    │    │ - choose()   │    │ - drawAgent()    │
              │ - choose()   │    └──────┬───────┘    └──────────────────┘
              └──────────────┘           │
                                         ▼
                                  ┌──────────────────┐
                                  │PlayerController  │
                                  │ [Manual Input]   │
                                  │ [Stats Tracking] │
                                  └──────────────────┘
                                         │
                    ┌────────────────────┴──────────────────┐
                    ▼                                       ▼
        ┌──────────────────────┐          ┌────────────────────────┐
        │  ChartRenderer.js    │          │  BoardStates.js        │
        │ [Performance Graphs] │          │ [Cell Type Constants]  │
        └──────────────────────┘          └────────────────────────┘
```

### Module Responsibilities

| Module | Location | Responsibility | Key Methods |
|--------|----------|-----------------|-------------|
| **Qtable** | `agent/Qtable.js` | Core Q-Learning algorithm | `init()`, `learn()`, `chooseAction()` |
| **AIController** | `game/AIController.js` | Training loop & episode management | `train()`, `runEpisode()` |
| **PlayerController** | `game/PlayerController.js` | Manual player movement & stats | `movePlayer()`, `updateStats()` |
| **BoardOrquestrator** | `game/BoardOrquestator.js` | Main loop, coordination | `init()`, `gameLoop()` |
| **BoardRender** | `game/BoardRender.js` | Canvas drawing | `drawGrid()`, `drawAgent()`, `drawCell()` |
| **BoardInputs** | `game/BoardInputs.js` | Keyboard & mouse handling | `setupInputs()` |
| **ChartRenderer** | `game/ChartRenderer.js` | Real-time performance graphs | `updateChart()` |
| **BoardStates** | `game/BoardStates.js` | State type definitions | `WALL`, `GOAL`, `START`, etc. |
| **Configs** | `game/configs/Configs.js` | Global parameters | `DELAY`, `REWARD`, `ACTIONS` |

### Data Flow During Training

```
User clicks "Start Training"
         │
         ▼
BoardOrquestrator.init() 
    ├─ Create Q-Table
    ├─ Initialize board
    └─ Start gameLoop()
         │
         ▼
AIController.train() [EPISODE LOOP]
    │
    ├─ Agent position = (2, 9)
    │
    ├─ chooseAction() → Qtable.chooseAction()
    │       └─ Returns UP/DOWN/LEFT/RIGHT
    │
    ├─ Move agent
    │
    ├─ Calculate reward
    │
    ├─ Qtable.learn() [BELLMAN UPDATE]
    │       └─ Updates Q[(2,9)][UP]
    │
    ├─ Check if goal reached or death
    │
    ├─ Repeat until episode ends
    │
    └─ Record stats & update chart
```

---

## 🎮 User Guide: Operating the Application

### Opening & Initial Setup

1. **Open `index.html`** in your browser
2. You'll see:
   - **Left sidebar**: Controls (buttons, inputs)
   - **Center canvas**: 5×10 board with green start and yellow goal
   - **Right panel**: Real-time performance graph

### Training Controls

| Control | Action | Effect |
|---------|--------|--------|
| **Start Training** | Button | Begins AI learning loop |
| **Stop Training** | Button | Pauses ongoing training |
| **Reset Q-Table** | Button | Clear all learning (restart) |
| **Epsilon Input** | 0.0 - 1.0 | Adjust exploration rate in real-time |
| **Delay Input** | ms | Speed of agent movement |

### Board Interaction

```
┌─ MOUSE CONTROLS ─────────────────────┐
│                                      │
│  Left Click + Drag  → Draw walls    │
│  Right Click + Drag → Erase walls   │
│                                      │
│  ⚠️  Can modify board WHILE training │
│      (Q-Table adapts dynamically!)   │
│                                      │
└──────────────────────────────────────┘

┌─ VISUAL STATE LEGEND ─────────────────────┐
│                                           │
│  🟢 Green  = Agent current position      │
│  🟡 Yellow = Goal/Target location        │
│  ⬛ Black  = Wall (obstacle)             │
│  ⬜ White  = Empty/walkable              │
│                                           │
└───────────────────────────────────────────┘
```

### Interpreting the Performance Chart

The graph displays two lines:

```
        Steps per Episode
             ▲
        30   │  ╱─ Blue line (all episodes)
             │ ╱  Noisy, shows raw performance
        20   │╱
             │ ╲╲____
        10   │      ╲╲.__
             │          ╲╲____ Orange line (moving avg)
         5   │               ╲  Smooth trend shows learning
             │                ╲
         0   └──────────────────────────────► Episodes
             0    50    100   150    200
```

**Interpretation**:
- **Downward trend** = Learning happening ✓
- **Plateauing** = Agent converged (found good policy)
- **Spikes up** = Sudden change in board (dynamic obstacle)

---

## 🔧 Technical Reference & API

### Qtable.js API

#### `new Qtable(boardWidth, boardHeight, actions)`
Initialize Q-Table for given board dimensions.

```javascript
const q = new Qtable(5, 10, ['UP', 'DOWN', 'LEFT', 'RIGHT']);
// Creates Q-Table: { (x,y): [0,0,0,0], ... }
```

#### `chooseAction(state, epsilon)`
Returns best action or random action with probability epsilon.

```javascript
const action = q.chooseAction(state, 0.1);
// Returns: action index (0=UP, 1=DOWN, 2=LEFT, 3=RIGHT)
```

#### `learn(state, action, reward, nextState, alpha, gamma)`
Updates Q-value using Bellman equation.

```javascript
q.learn(
    {x: 2, y: 9},      // current state
    0,                  // action index (UP)
    -1,                 // reward
    {x: 2, y: 8},      // next state
    0.1,               // alpha (learning rate)
    0.9                // gamma (discount factor)
);
```

### Configs.js Parameters

| Parameter | Default | Range | Effect |
|-----------|---------|-------|--------|
| **ALPHA** (Learning Rate) | 0.1 | 0.01 - 0.5 | How aggressively to update Q-values |
| **GAMMA** (Discount Factor) | 0.9 | 0.5 - 0.99 | How much to account for future rewards |
| **EPSILON** (Exploration) | 0.1 | 0.0 - 1.0 | Probability of random action (0=greedy, 1=random) |
| **DELAY** (Episode Speed) | 1000 ms | 100 - 5000 | Time between agent steps |
| **REWARD.GOAL** | +20 | - | Reward for reaching goal |
| **REWARD.STEP** | -1 | - | Cost per step (encourages efficiency) |
| **REWARD.DEATH** | -10 | - | Penalty for hitting wall |

### Reward System (Board Configuration)

```javascript
BOARD: {
    width: 5,           // 5 columns (0-4)
    height: 10,         // 10 rows (0-9)
    start: {x: 2, y: 9} // Green: bottom-center
    goal: {x: 2, y: 0}  // Yellow: top-center
}

REWARD: {
    GOAL: +20,   // Success: reached goal
    STEP: -1,    // Cost per step (encourages shortest path)
    DEATH: -10   // Failure: hit wall
}
```

---

## 💡 Examples & Use Cases

### Example 1: Basic Training Session

**Scenario**: Train agent on empty board for 50 episodes.

**Steps**:
1. Open `index.html`
2. Clear any walls (board should be empty)
3. Click **"Start Training"**
4. Wait 50 episodes (~50 seconds at default delay)
5. **Observe**: Chart shows ~30 steps dropping to ~7 steps

**Why**: Agent learns direct path from (2,9) → (2,0) in straight line.

### Example 2: Dynamic Environment Learning

**Scenario**: Modify the board WHILE training to see adaptive learning.

**Steps**:
1. Start training (let it run for 20-30 episodes)
2. Draw a **vertical wall** in the middle of the board
3. **Observe**: Agent's steps spike temporarily
4. **Then**: Chart trends down again as agent finds new paths

**Why**: Q-Table is dynamic. Rewards for old path decrease when blocked, agent explores alternatives.

### Example 3: Adjusting Epsilon (Exploration)

**Scenario**: Understand the effect of exploration.

**Steps**:
1. **First run**: Set epsilon = 0.5, train for 30 episodes
   - Observe: More chaotic, slower convergence
2. **Second run**: Reset Q-Table, set epsilon = 0.05
   - Observe: Faster convergence, smoother curve

**Why**: Low epsilon = more exploitation, faster refinement. High epsilon = more exploration, might find better paths but slower.

---

## ❓ Troubleshooting & FAQs

### Q: Agent moves randomly and never improves

**A**: Check:
- [ ] Epsilon is not 1.0 (disable exploration)
- [ ] Alpha > 0 (learning rate must be positive)
- [ ] Reward structure is correct (positive for goal, negative for steps)

**Fix**: Reset Q-Table and retrain with default parameters.

### Q: Performance charts show spikes up and down

**A**: Expected behavior with dynamic obstacles.

**Normal when**:
- [ ] You're drawing walls while training
- [ ] Reward structure changed during session

**To see smooth convergence**: Clear board and train on static environment.

### Q: Agent seems "stuck" moving in circles

**A**: Likely causes:
- [ ] Board has no path to goal (unreachable)
- [ ] Reward for goal is too low relative to step cost

**Fix**: 
- Verify yellow goal square exists
- Increase `REWARD.GOAL` value in Configs

### Q: How do I export/save the Q-Table?

**GUI (Recommended)**: The project include a "Save Q-Table" button that downloads the current Q-Table as JSON.

1. **Save Q-Table**: Click the button to download `qtable.json`
2. **Load Q-Table**: Use the "Load Q-Table" button to upload a previously saved JSON file.
```

### Q: Can I use this with keyboard-only control?

**A**: Yes, modify `PlayerController.js` to call movement functions with arrow keys. Currently supports mouse drawing and manual position updates.

---

## 🎓 Key Takeaways & Learning Outcomes

### What You Learn By Building This

1. **Bellman Equation in Action**: Not just theory, but working code that applies it
2. **Separation of Concerns**: AI logic (Qtable) completely decoupled from rendering
3. **Exploration-Exploitation Tradeoff**: Hands-on understanding of ε-greedy strategy
4. **Real-time Visualization**: How to debug ML algorithms visually
5. **Modular JavaScript Architecture**: Scalable design patterns for complex systems

### Why Q-Learning for This?

| Aspect | Q-Learning | Why It Fits |
|--------|-----------|-----------|
| **Complexity** | Simple | Good for learning RL fundamentals |
| **Convergence** | Guaranteed (finite state) | Tabular method will converge on this board |
| **Memory** | Low (5×10 board) | No need for function approximation |
| **Real-time** | Fast | Instant Q-updates ✓ |

---

## 🚀 Next Steps & Future Improvements

### Implemented (Week 2)
- ✅ Q-Learning core algorithm
- ✅ Interactive board editing
- ✅ Real-time performance metrics

### Potential Improvements
- [ ] **Deep Q-Networks (DQN)**: Handle larger/image-based state spaces
- [ ] **Persistent Storage**: Save/load Q-Tables from localStorage
- [ ] **Multi-Agent**: Compete or cooperate agents
- [ ] **3D Environment**: Extend to Three.js for spatial navigation
- [ ] **Hyperparameter Tuning GUI**: Adjust α, γ, ε without code changes

### Future Applications
- **Game AI**: NPC pathfinding in RPGs
- **Robotics**: Motion planning for autonomous agents
- **Logistics**: Route optimization with dynamic costs
- **Web Servers**: GODOT 3D + Microcontroller integration

---

## 📖 Project Insights & Reflections

### Week 2: What I Learned

**The Aha Moment**: Before this project, Reinforcement Learning felt like a black box. Implementing Q-Table from scratch—watching the agent fail, gradually improve, and eventually master the board—made everything click.

**Technical Breakthrough**: The **separation of concerns** between `Qtable.js` (pure algorithm) and the rest of the codebase (UI/input/animation) was transformative. Testing became isolated and bugs easier to find.

**Design Principle**: Modular architecture isn't just code quality—it's how you think about complex systems. Each module has one job, clear boundaries, and minimal coupling.

**Most Challenging**: Synchronizing the AI's internal state with Canvas frames and chart updates without drops in performance. Solved by using requestAnimationFrame efficiently.

---

## 👨‍💻 Author & Contributions

- **Carlos Enrique Cochero Ramos**
- GitHub: [@caertos](https://github.com/caertos)
- Part of **52 Projects Challenge** to improve programming skills

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

---

## 🔗 Resources & Further Reading

### RL Theory
- Sutton & Barto: "Reinforcement Learning - An Introduction"
- Q-Learning paper: Watkins & Dayan (1992)

### Web Technologies
- Canvas API: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- JavaScript Game Loops: [Game Loop Pattern](https://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing)

---

**Happy Learning! 🚀** Feel free to fork, modify, and share your improvements!
