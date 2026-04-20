import { onMount, onCleanup, createEffect } from "solid-js";

// Boje za kategorije
const COLORS = [
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#f97316", // orange
  "#14b8a6", // teal
];

export default function ExpenseChart({ data }) {
  let canvasRef;
  let chartInstance = null;

  const buildChart = () => {
    
    if (typeof Chart === "undefined" || !canvasRef) return;

    // Uništi stari graf ako postoji
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    const labels = data().map(([cat]) => cat);
    const values = data().map(([, amount]) => amount);

    if (labels.length === 0) return;

    chartInstance = new Chart(canvasRef, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: COLORS.slice(0, labels.length),
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 16,
              font: { size: 12 },
              usePointStyle: true,
              pointStyleWidth: 8,
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = ((ctx.parsed / total) * 100).toFixed(1);
                const eur = new Intl.NumberFormat("hr-HR", {
                  style: "currency",
                  currency: "EUR",
                }).format(ctx.parsed);
                return ` ${eur} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  };

  onMount(() => {
    if (typeof Chart !== "undefined") {
      buildChart();
    } else {
      // Čekaj da se script učita
      const script = document.getElementById("chartjs-script");
      if (script) script.addEventListener("load", buildChart);
    }
  });

  // Ponovno crtaj kad se podaci promijene
  createEffect(() => {
    data();
    buildChart();
  });

  onCleanup(() => {
    if (chartInstance) chartInstance.destroy();
  });

  return (
    <div style={{ position: "relative", height: "280px", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}