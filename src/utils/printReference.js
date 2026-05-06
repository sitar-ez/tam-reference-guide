import { APP_NAME, APP_VERSION } from "../constants/appMeta";
import { SOURCES } from "../data/referenceData";
import { formatDurationLabel } from "./referenceUtils";

/**
 * Opens a browser print window for the currently selected dosage reference.
 * Users can save that print dialog as a PDF in the browser.
 *
 * @param {object} params - Print context from the app.
 */
export function printDosageReference({
  selected,
  activeSrc,
  allSourceIds,
  dose,
  doseLabel,
  booster,
  currentEffects,
  safetyNotes,
  isCombination,
  comboSubstances,
  comboDoses,
}) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=960,height=1200");

  if (!printWindow) {
    window.alert("Please allow pop-ups to print or export this reference.");
    return;
  }

  const sourceMarkup = allSourceIds
    .map((id, index) => ({ id, ...SOURCES[id] }))
    .filter((source) => source.title)
    .map(
      (source, index) => `
        <li>
          <strong>[${index + 1}] ${escapeHtml(source.title)}</strong><br />
          ${escapeHtml(source.authors)} — <em>${escapeHtml(source.journal)}</em>, ${escapeHtml(
            String(source.year)
          )}<br />
          <a href="${source.url}">${source.url}</a>
        </li>
      `
    )
    .join("");

  const bodyMarkup = isCombination
    ? renderCombinationMarkup({ selected, comboSubstances, comboDoses })
    : renderSingleReferenceMarkup({
        selected,
        activeSrc,
        dose,
        doseLabel,
        booster,
        currentEffects,
        safetyNotes,
      });

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(selected.name)} dosage reference</title>
      <style>
        body {
          font-family: Georgia, "Times New Roman", serif;
          color: #172033;
          margin: 0;
          background: #ffffff;
        }
        main {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 32px 56px;
        }
        h1, h2, h3 {
          margin: 0;
          color: #0e1628;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 8px;
        }
        h2 {
          font-size: 20px;
          margin: 28px 0 12px;
        }
        p, li {
          font-size: 14px;
          line-height: 1.7;
        }
        ul {
          margin: 10px 0 0 18px;
          padding: 0;
        }
        .meta {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #d7dfef;
        }
        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          background: #eef6f6;
          color: #0f7377;
          font: 600 12px/1.2 Arial, sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 12px;
        }
        .card {
          border: 1px solid #d7dfef;
          border-radius: 12px;
          padding: 14px;
          background: #f7fafc;
        }
        .label {
          color: #52627d;
          font: 600 11px/1.2 Arial, sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .value {
          font: 700 18px/1.2 Arial, sans-serif;
          color: #172033;
        }
        .small {
          color: #52627d;
          font: 400 12px/1.6 Arial, sans-serif;
        }
        @media print {
          main {
            padding: 24px;
          }
          a {
            color: inherit;
            text-decoration: none;
          }
        }
      </style>
    </head>
    <body>
      <main>
        <div class="meta">
          <div>
            <div class="badge">Version ${escapeHtml(APP_VERSION)}</div>
            <h1>${escapeHtml(selected.name)} Reference</h1>
            <p>${escapeHtml(APP_NAME)}</p>
          </div>
          <div class="small">
            Generated: ${escapeHtml(new Date().toLocaleString())}<br />
            Exported from the dosage reference view
          </div>
        </div>
        ${bodyMarkup}
        <h2>Sources</h2>
        <ol>${sourceMarkup || "<li>No sources available for this selection.</li>"}</ol>
      </main>
    </body>
  </html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

/**
 * Renders the print markup for a single substance reference.
 * @param {object} params - Print context for a single substance.
 * @returns {string} HTML body content.
 */
function renderSingleReferenceMarkup({
  selected,
  activeSrc,
  dose,
  doseLabel,
  booster,
  currentEffects,
  safetyNotes,
}) {
  return `
    <div class="badge">${escapeHtml(activeSrc.category || selected.category)}</div>
    <div class="grid">
      <div class="card">
        <div class="label">Selected Dose</div>
        <div class="value">${escapeHtml(formatDose(dose, activeSrc.unit))}</div>
        <div class="small">${escapeHtml(doseLabel?.label || "Moderate")} tier</div>
      </div>
      <div class="card">
        <div class="label">Timeline</div>
        <div class="value">${escapeHtml(formatTimeline(activeSrc))}</div>
        <div class="small">Onset ${escapeHtml(formatOnset(activeSrc.onset))}</div>
      </div>
      <div class="card">
        <div class="label">Booster</div>
        <div class="value">${booster?.enabled ? "Included" : "Off"}</div>
        <div class="small">${
          booster?.enabled
            ? `${escapeHtml(formatDose(booster.dose, activeSrc.unit))} at ${escapeHtml(
                `${booster.time} min`
              )}`
            : "No booster selected"
        }</div>
      </div>
    </div>

    <h2>Dose Reference</h2>
    <ul>
      <li>Threshold: ${escapeHtml(formatDose(activeSrc.doses.threshold, activeSrc.unit))}</li>
      <li>Light: ${escapeHtml(formatDose(activeSrc.doses.light, activeSrc.unit))}</li>
      <li>Moderate: ${escapeHtml(formatDose(activeSrc.doses.moderate, activeSrc.unit))}</li>
      <li>Strong: ${escapeHtml(formatDose(activeSrc.doses.strong, activeSrc.unit))}</li>
      <li>Heavy: ${escapeHtml(formatDose(activeSrc.doses.heavy, activeSrc.unit))}</li>
    </ul>

    <h2>Expected Effects</h2>
    <ul>${(currentEffects || []).map((effect) => `<li>${escapeHtml(effect)}</li>`).join("")}</ul>

    <h2>Safety Notes</h2>
    <ul>${safetyNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
  `;
}

/**
 * Renders the print markup for a combination reference.
 * @param {object} params - Print context for a combination.
 * @returns {string} HTML body content.
 */
function renderCombinationMarkup({ selected, comboSubstances, comboDoses }) {
  return `
    <div class="badge">Combination</div>
    <p>${escapeHtml(selected.description || "")}</p>
    <h2>Timing Guidance</h2>
    <p>${escapeHtml(selected.timing || "No timing guidance available.")}</p>

    <h2>Component Doses</h2>
    <ul>
      ${comboSubstances
        .map(
          (substance) =>
            `<li>${escapeHtml(substance.name)}: ${escapeHtml(
              formatDose(comboDoses[substance.id] ?? substance.doses.moderate, substance.unit)
            )}</li>`
        )
        .join("")}
    </ul>

    <h2>Safety Notes</h2>
    <ul>${selected.safety.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
  `;
}

/**
 * Formats an onset label for print output.
 * @param {number} onset - Onset in minutes.
 * @returns {string} Readable onset label.
 */
function formatOnset(onset) {
  return onset < 5 ? `${Math.round(onset * 60)} sec` : `${onset} min`;
}

/**
 * Formats the timeline summary string.
 * @param {object} activeSrc - Active source data for the selection.
 * @returns {string} Readable timeline summary.
 */
function formatTimeline(activeSrc) {
  return `Peak ${activeSrc.peak} min • Duration ${formatDurationLabel(activeSrc.duration)}`;
}

/**
 * Formats a dose and unit as a single label.
 * @param {number} dose - Numeric dose.
 * @param {string} unit - Unit suffix.
 * @returns {string} Formatted dose text.
 */
function formatDose(dose, unit) {
  const formattedDose = dose < 1 ? dose.toFixed(2) : Number(dose).toString();
  return `${formattedDose} ${unit}`;
}

/**
 * Escapes user-visible strings before writing to the print document.
 * @param {string} value - Text to escape.
 * @returns {string} Escaped HTML-safe text.
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
