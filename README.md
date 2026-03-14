# Reinforcement Learning (Q-Table)
### Read it in [Español](README_ES.md)

A static JavaScript application that implements a Reinforcement Learning agent using a Q-Table to navigate an interactive board. This project is part of my "52 Projects" challenge to improve my programming skills.

## Features

- **Q-Learning Algorithm**: Implementation of the Bellman equation for pathfinding optimization.
- **Interactive Canvas**: Draw or erase walls and paths directly on the board in real-time.
- **Dynamic Visualization**: Real-time chart rendering to track performance metrics.
- **Modular Architecture**: Clean separation between AI logic, game state, and UI rendering.
- **Performance Metrics**: Tracks episodes, steps, deaths, and calculates minimum/average steps.

## Requirements

- Any modern Web Browser (Chrome, Firefox, Edge, etc.).
- No installation required (Static JS project).

## Modular Structure

The project is organized into specialized controllers to ensure scalability:
- `Qtable.js`: Core logic for the reinforcement learning algorithm.
- `AIController.js`: Manages the agent's decision-making and learning process.
- `PlayerController.js`: Handles manual human interaction and board editing.
- `ChartRenderer.js`: Responsible for updating the performance graphs.
- `BoardOrquestator.js`: Coordinates the interaction between all components and the game loop.

## Project

Part of 52 projects to improve programming skills - Week 2

# Week 2: Reinforcement Learning (Q-Table)

## What did I understand better?
- **Modularization**: How to decouple the learning algorithm from the rendering logic, making the code much easier to debug.
- **Bellman Equation**: The practical application of rewards and discounts to update state-action values.
- **Exploration vs Exploitation**: Balancing the `epsilon` parameter to let the agent discover new paths while leveraging its known best moves.

## What was most challenging?
- **Controller Separation**: Designating clear boundaries between `AIController` and `PlayerController` to avoid state conflicts.
- **UI Synchronization**: Syncing the AI's internal steps with the Canvas animation frames and the real-time chart updates without performance drops.

## What technical decision was key?
- **Separation of Concerns**: Implementing `PlayerController`, `AIController`, and `ChartRenderer` as independent modules. This allowed for isolated testing of the AI logic without worrying about the visualization layer.
- **Real-time Drawing**: Allowing the user to modify the environment dynamically while the agent is learning, which highlights the adaptability of the Q-Table.

## Where can I use these concepts in the future?
- **Game AI**: Creating NPCs that adapt to player behavior or navigate complex procedural environments.
- **Optimization Problems**: Solving logistics or routing problems where paths need to be optimized based on variable costs.
- **Robotics Simulations**: Implementing basic navigation logic for autonomous agents in simulated environments.

## Where would I like to try it?
- I'm interested in applying these RL concepts using **Python with TensorFlow or PyTorch** to move from Q-Tables to Deep Q-Networks (DQN) for more complex state spaces.
- Implementing a similar agent in a 3D environment using **Three.js** to explore spatial navigation.

## Final Reflection
Before this project, RL seemed like a "black box." Building a Q-Table from scratch and seeing the agent fail, learn, and eventually master the board was incredibly rewarding. It demystified how machines "learn" through trial and error and reinforced the importance of a clean, modular architecture when dealing with complex logic.

# Author
- Carlos Enrique Cochero Ramos
- GitHub: [caertos](https://github.com/caertos)

# License
This project is licensed under the MIT License.
