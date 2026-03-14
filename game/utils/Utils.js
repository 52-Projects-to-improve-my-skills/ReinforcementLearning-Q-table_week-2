export function forEachCell(callback) {
    for (let x = 0; x < totalHorizontalCells; x++) {
      for (let y = 0; y < totalVerticalCells; y++) {
        callback(x, y);
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
    const stepsElement = document.getElementById("stat-steps");
    const deathsElement = document.getElementById("stat-deaths");

    if (stepsElement) stepsElement.textContent = steps;
    if (deathsElement) deathsElement.textContent = deaths;
}