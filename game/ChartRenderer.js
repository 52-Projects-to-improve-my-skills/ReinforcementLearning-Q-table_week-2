// ChartRenderer.js

export function drawChart(episodeSteps, successSteps) {
  const chartCanvas = document.getElementById("chart");
  if (!chartCanvas) return;
  const ctx = chartCanvas.getContext("2d");
  const W = chartCanvas.width;
  const H = chartCanvas.height;
  const PAD = { top: 28, right: 24, bottom: 40, left: 52 };
  const data = episodeSteps.slice(-300);

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, W, H);

  if (data.length < 2) {
    ctx.fillStyle = "#888";
    ctx.font = "13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Esperando datos de episodios...", W / 2, H / 2);
    return;
  }

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...data, 1);
  const toX = (i) => PAD.left + (i / (data.length - 1)) * innerW;
  const toY = (v) => PAD.top + innerH - (v / maxVal) * innerH;

  // Grid
  for (let i = 0; i <= 5; i++) {
    const y = PAD.top + (i / 5) * innerH;
    ctx.strokeStyle = "#2a2a4a";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.left, y);
    ctx.lineTo(W - PAD.right, y);
    ctx.stroke();
    ctx.fillStyle = "#666";
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    ctx.fillText(Math.round(maxVal * (1 - i / 5)), PAD.left - 6, y + 4);
  }

  // Ejes
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD.left, PAD.top);
  ctx.lineTo(PAD.left, PAD.top + innerH);
  ctx.lineTo(W - PAD.right, PAD.top + innerH);
  ctx.stroke();

  // Etiqueta X
  ctx.fillStyle = "#888";
  ctx.font = "11px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`Episodios (últimos ${data.length})`, W / 2, H - 8);

  // Línea de pasos por episodio
  ctx.strokeStyle = "rgba(80,160,255,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  data.forEach((v, i) =>
    i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v))
  );
  ctx.stroke();

  // Media móvil (ventana 20)
  const WIN = Math.min(20, Math.floor(data.length / 2));
  if (WIN >= 2) {
    ctx.strokeStyle = "#ffaa00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    for (let i = WIN - 1; i < data.length; i++) {
      const avg =
        data.slice(i - WIN + 1, i + 1).reduce((a, b) => a + b, 0) / WIN;
      if (!started) {
        ctx.moveTo(toX(i), toY(avg));
        started = true;
      } else {
        ctx.lineTo(toX(i), toY(avg));
      }
    }
    ctx.stroke();
  }

  // Línea del mínimo (solo episodios con meta alcanzada)
  if (successSteps.length > 0) {
    const best = Math.min(...successSteps);
    const bestY = toY(best);
    ctx.strokeStyle = "#55ff88";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(PAD.left, bestY);
    ctx.lineTo(W - PAD.right, bestY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#55ff88";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`mín: ${best}`, PAD.left + 4, bestY - 4);
  }

  // Leyenda
  [
    { color: "rgba(80,160,255,0.8)", label: "Pasos / ep." },
    { color: "#ffaa00",             label: `Media (${WIN})` },
    { color: "#55ff88",             label: "Mínimo (meta)" },
  ].forEach(({ color, label }, idx) => {
    const lx = PAD.left + 8 + idx * 150;
    const ly = PAD.top + 10;
    ctx.fillStyle = color;
    ctx.fillRect(lx, ly - 3, 14, 3);
    ctx.fillStyle = "#ccc";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(label, lx + 18, ly + 1);
  });
}
