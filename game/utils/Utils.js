export function forEachCell(callback) {
    for (let cellX = 0; cellX < totalHorizontalCells; cellX++) {
      for (let cellY = 0; cellY < totalVerticalCells; cellY++) {
        callback(cellX, cellY);
      }
    }
  }

export function isValidCell(x, y) {
    return (
      x >= 0 && x < totalHorizontalCells && y >= 0 && y < totalVerticalCells
    );
  }

export function getCellCoordinates(event, cellSize) {
  return {
    x: Math.floor(event.offsetX / cellSize),
    y: Math.floor(event.offsetY / cellSize),
  };
}

export function updateUI(steps, deaths) {
    const stepsDisplay = document.getElementById("stat-steps");
    const deathsDisplay = document.getElementById("stat-deaths");

    if (stepsDisplay) stepsDisplay.textContent = steps;
    if (deathsDisplay) deathsDisplay.textContent = deaths;
}