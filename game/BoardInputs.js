// BoardInputs.js

import { getCellCoordinates } from "./utils/Utils.js";

export function hoveredCell(canvas, cellSize, callback) {
  canvas.onmousemove = (event) => callback(getCellCoordinates(event, cellSize));
}

export function clickDetection(canvas, cellSize, callback) {
  canvas.onmouseup = (event) => callback(getCellCoordinates(event, cellSize));
}
