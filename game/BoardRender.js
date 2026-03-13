// BoardRender.js

export function drawBoard(context, canvas) {
  context.fillStyle = "#333";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawSquare(context, cellSize, selectedCell, color) {
  context.fillStyle = color;
  context.fillRect(
    selectedCell.x * cellSize,
    selectedCell.y * cellSize,
    cellSize,
    cellSize,
  );
}

export function clearSquare(context, cellSize, selectedCell) {
  context.fillStyle = "#333";
  context.fillRect(
    selectedCell.x * cellSize,
    selectedCell.y * cellSize,
    cellSize,
    cellSize,
  );
}
