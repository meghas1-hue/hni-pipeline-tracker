const STAGES = [
  "Prospect",
  "Contact",
  "Meeting",
  "Visit",
  "Proposal",
  "Funding",
  "Stewardship"
];

function ensureContainer() {
  let container = document.getElementById("pipeline-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "pipeline-container";
    document.body.appendChild(container);
  }
  return container;
}

function renderPipeline(currentStage) {
  const container = ensureContainer();
  container.innerHTML = "";

  const currentIndex = STAGES.indexOf(currentStage);

  let html = `
    <div class="pipeline-card">
      <div class="pipeline-title">Pipeline Status</div>
      <div class="pipeline">
  `;

  STAGES.forEach((stage, index) => {
    let css = "pending";
    let icon = "";
    if (index < currentIndex) {
      css = "completed";
      icon = "✓";
    } else if (index === currentIndex) {
      css = "current";
      icon = "●";
    }
    html += `
      <div class="stage">
        <div class="circle ${css}">
          ${icon}
        </div>
        <div class="label">${stage}</div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function draw(data) {
  try {
    const rows = data.tables.DEFAULT;
    if (!rows || rows.length === 0) {
      renderPipeline("Prospect");
      return;
    }

    const row = rows[0];
    let currentStage = "";

    // Find Current Stage field automatically
    Object.keys(row).forEach(key => {
      if (key.toLowerCase().includes("stage")) {
        currentStage = row[key];
      }
    });

    if (!currentStage) {
      currentStage = "Prospect";
    }

    renderPipeline(currentStage);
  } catch (e) {
    console.error(e);
    renderPipeline("Prospect");
  }
}

// GitHub Test Mode + Looker Studio Mode
window.onload = function () {
  ensureContainer();

  if (typeof dscc !== "undefined") {
    dscc.subscribeToData(draw, {
      transform: dscc.objectTransform
    });
  } else {
    // Demo mode (only runs when opened outside Looker Studio,
    // e.g. directly in a browser tab for local testing)
    renderPipeline("Proposal");
  }
};
