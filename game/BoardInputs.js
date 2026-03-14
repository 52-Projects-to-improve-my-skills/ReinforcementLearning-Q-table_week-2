// BoardInputs.js

import { getCellCoordinates } from "./utils/Utils.js";

export function hoveredCell(canvas, cellSize, callback) {
  canvas.onmousemove = (event) => callback(getCellCoordinates(event, cellSize));
}

export function clickDetection(canvas, cellSize, callback) {
  canvas.onmouseup = (event) => callback(getCellCoordinates(event, cellSize));
}

export function keyboardControls(callback) {
  document.onkeydown = (event) => {
    let direction = null;
    switch (event.key) {
      case "ArrowUp":
        direction = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        direction = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        direction = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        direction = { x: 1, y: 0 };
        break;
    }
    if (direction) {
      callback(direction);
    }
  };
}
