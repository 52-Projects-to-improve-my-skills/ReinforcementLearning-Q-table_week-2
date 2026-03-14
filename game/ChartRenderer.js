// ChartRenderer.js

export function drawChart(episodeSteps, successSteps) {
  const chartCanvas = document.getElementById("chart");
  if (!chartCanvas) return;
  const ctx = chartCanvas.getContext("2d");
  const canvasWidth = chartCanvas.width;
  const canvasHeight = chartCanvas.height;
  const chartPadding = { top: 28, right: 24, bottom: 40, left: 52 };
  const recentEpisodeSteps = episodeSteps.slice(-300);

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  if (recentEpisodeSteps.length < 2) {
    ctx.fillStyle = "#888";
    ctx.font = "13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Esperando datos de episodios...", canvasWidth / 2, canvasHeight / 2);
    return;
  }

  const plotAreaWidth = canvasWidth - chartPadding.left - chartPadding.right;
  const plotAreaHeight = canvasHeight - chartPadding.top - chartPadding.bottom;
  const maxStepValue = Math.max(...recentEpisodeSteps, 1);
  const convertIndexToCanvasX = (episodeIndexParam) => chartPadding.left + (episodeIndexParam / (recentEpisodeSteps.length - 1)) * plotAreaWidth;
  const convertValueToCanvasY = (stepValueParam) => chartPadding.top + plotAreaHeight - (stepValueParam / maxStepValue) * plotAreaHeight;

  for (let gridLevel = 0; gridLevel <= 5; gridLevel++) {
    const gridLineY = chartPadding.top + (gridLevel / 5) * plotAreaHeight;
    ctx.strokeStyle = "#2a2a4a";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartPadding.left, gridLineY);
    ctx.lineTo(canvasWidth - chartPadding.right, gridLineY);
    ctx.stroke();
    ctx.fillStyle = "#666";
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    ctx.fillText(Math.round(maxStepValue * (1 - gridLevel / 5)), chartPadding.left - 6, gridLineY + 4);
  }

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(chartPadding.left, chartPadding.top);
  ctx.lineTo(chartPadding.left, chartPadding.top + plotAreaHeight);
  ctx.lineTo(canvasWidth - chartPadding.right, chartPadding.top + plotAreaHeight);
  ctx.stroke();

  ctx.fillStyle = "#888";
  ctx.font = "11px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`Episodios (últimos ${recentEpisodeSteps.length})`, canvasWidth / 2, canvasHeight - 8);

  ctx.strokeStyle = "rgba(80,160,255,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  recentEpisodeSteps.forEach((stepValue, episodeIndex) =>
    episodeIndex === 0 ? ctx.moveTo(convertIndexToCanvasX(episodeIndex), convertValueToCanvasY(stepValue)) : ctx.lineTo(convertIndexToCanvasX(episodeIndex), convertValueToCanvasY(stepValue))
  );
  ctx.stroke();

  const movingAverageWindow = Math.min(20, Math.floor(recentEpisodeSteps.length / 2));
  if (movingAverageWindow >= 2) {
    ctx.strokeStyle = "#ffaa00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    let hasStartedPath = false;
    for (let i = movingAverageWindow - 1; i < recentEpisodeSteps.length; i++) {
      const movingAverageValue =
        recentEpisodeSteps.slice(i - movingAverageWindow + 1, i + 1).reduce((accumulator, value) => accumulator + value, 0) / movingAverageWindow;
      if (!hasStartedPath) {
        ctx.moveTo(convertIndexToCanvasX(i), convertValueToCanvasY(movingAverageValue));
        hasStartedPath = true;
      } else {
        ctx.lineTo(convertIndexToCanvasX(i), convertValueToCanvasY(movingAverageValue));
      }
    }
    ctx.stroke();
  }

  if (successSteps.length > 0) {
    const minimumSuccessSteps = Math.min(...successSteps);
    const minimumSuccessStepsY = convertValueToCanvasY(minimumSuccessSteps);
    ctx.strokeStyle = "#55ff88";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(chartPadding.left, minimumSuccessStepsY);
    ctx.lineTo(canvasWidth - chartPadding.right, minimumSuccessStepsY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#55ff88";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`mín: ${minimumSuccessSteps}`, chartPadding.left + 4, minimumSuccessStepsY - 4);
  }

  [
    { color: "rgba(80,160,255,0.8)", label: "Pasos / ep." },
    { color: "#ffaa00",             label: `Media (${movingAverageWindow})` },
    { color: "#55ff88",             label: "Mínimo (meta)" },
  ].forEach(({ color, label }, legendItemIndex) => {
    const legendX = chartPadding.left + 8 + legendItemIndex * 150;
    const legendY = chartPadding.top + 10;
    ctx.fillStyle = color;
    ctx.fillRect(legendX, legendY - 3, 14, 3);
    ctx.fillStyle = "#ccc";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(label, legendX + 18, legendY + 1);
  });
}
