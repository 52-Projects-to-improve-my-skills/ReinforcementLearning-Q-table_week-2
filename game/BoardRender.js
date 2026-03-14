// BoardRender.js

export function drawBoard(context, canvas) {
  context.fillStyle = "#333";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawSquare(context, cellSize, cellCoordinates, color) {
  context.fillStyle = color;
  context.fillRect(
    cellCoordinates.x * cellSize,
    cellCoordinates.y * cellSize,
    cellSize,
    cellSize,
  );
}

export function clearSquare(context, cellSize, cellCoordinates) {
  context.fillStyle = "#333";
  context.fillRect(
    cellCoordinates.x * cellSize,
    cellCoordinates.y * cellSize,
    cellSize,
    cellSize,
  );
}
