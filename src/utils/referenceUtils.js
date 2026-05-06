import { C } from "../data/referenceData";

/**
 * Grid filter tabs shown above the single-substance grid.
 * The requested UI only exposes the most common high-level groupings.
 */
export const GRID_CATEGORY_OPTIONS = [
  { id: "all", label: "All" },
  { id: "tryptamines", label: "Tryptamines", categories: ["Tryptamine"] },
  { id: "phenethylamines", label: "Phenethylamines", categories: ["Phenethylamine"] },
  { id: "dissociatives", label: "Dissociatives", categories: ["Dissociative"] },
  { id: "empathogens", label: "Empathogens", categories: ["Empathogen"] },
];

/**
 * Returns the dose category string for a given dose value.
 * @param {object} doses - { threshold, light, moderate, strong, heavy }
 * @param {number} dose - Current dose in the substance's unit.
 * @returns {string} Dose tier identifier.
 */
export function getDoseCategory(doses, dose) {
  const d = doses;
  if (dose < d.threshold) return "sub-threshold";
  if (dose < d.light) return "light";
  if (dose < d.moderate) return "moderate";
  if (dose < d.strong) return "strong";
  return "heavy";
}

/**
 * Returns a display label and accent color for the current dose tier.
 * @param {object} doses - Dose thresholds object.
 * @param {number} dose - Current dose value.
 * @returns {{ label: string, color: string }} UI label metadata.
 */
export function getDoseCategoryLabel(doses, dose) {
  const d = doses;
  if (dose < d.threshold) return { label: "Sub-threshold", color: C.greyDim };
  if (dose < d.light) return { label: "Threshold", color: C.tealSoft };
  if (dose < d.moderate) return { label: "Light", color: C.teal };
  if (dose < d.strong) return { label: "Moderate", color: C.tealSat };
  if (dose < d.heavy) return { label: "Strong", color: C.warning };
  return { label: "Heavy", color: C.danger };
}

/**
 * Generates `{t, v}` data points for the intensity graph SVG.
 *
 * @param {number} onset - Minutes to first effects.
 * @param {number} peak - Minutes to peak intensity.
 * @param {number} duration - Total duration in minutes.
 * @param {number} maxIntensity - Peak intensity on a 0-10 scale.
 * @param {object|null} booster - Optional booster curve metadata.
 * @returns {Array<{t: number, v: number}>} Sampled curve points.
 */
export function generateCurve(onset, peak, duration, maxIntensity, booster) {
  const totalTime = booster
    ? Math.max(duration, booster.time + booster.duration) + 30
    : duration + 30;
  const points = [];

  for (let t = 0; t <= totalTime; t += 2) {
    let intensity = 0;

    if (t >= onset) {
      const rampTime = Math.max(1, peak - onset);
      const decayTime = Math.max(1, duration - peak);
      intensity =
        t <= peak
          ? maxIntensity * ((t - onset) / rampTime)
          : maxIntensity * Math.exp(-(t - peak) / (decayTime * 0.7));
    }

    if (booster && t >= booster.time) {
      const boosterTime = t - booster.time;
      const boosterPeak = Math.max(1, booster.peak);
      const boosterDuration = Math.max(1, booster.duration);
      const boosterIntensity =
        boosterTime <= boosterPeak
          ? booster.intensity * (boosterTime / boosterPeak)
          : booster.intensity *
            Math.exp(-(boosterTime - boosterPeak) / (boosterDuration * 0.5));
      intensity = Math.min(10, intensity + boosterIntensity);
    }

    points.push({ t, v: Math.max(0, intensity) });
  }

  return points;
}

/**
 * Filters the single-substance grid by free-text query and category tab.
 * @param {Array<object>} substances - All single-substance entries.
 * @param {string} searchQuery - User-entered search text.
 * @param {string} categoryFilter - Active category tab id.
 * @returns {Array<object>} Filtered list for the grid.
 */
export function filterSubstances(substances, searchQuery, categoryFilter) {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const categoryConfig = GRID_CATEGORY_OPTIONS.find(
    (option) => option.id === categoryFilter
  );

  return substances.filter((substance) => {
    const categoryMatches =
      !categoryConfig ||
      !categoryConfig.categories ||
      categoryConfig.categories.includes(substance.category);

    if (!categoryMatches) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = `${substance.name} ${substance.category}`.toLowerCase();
    return searchableText.includes(normalizedQuery);
  });
}

/**
 * Finds the existing combination entry matching the selected ingredient set.
 * @param {Array<object>} combinations - All stored combination entries.
 * @param {string[]} substanceIds - Selected substance ids.
 * @returns {object|null} The matching combination or `null`.
 */
export function findCombinationByComponents(combinations, substanceIds) {
  const normalizedIds = substanceIds.filter(Boolean).sort();
  if (normalizedIds.length < 2) {
    return null;
  }

  return (
    combinations.find((combination) => {
      const comboIds = [...combination.components].sort();
      return (
        comboIds.length === normalizedIds.length &&
        comboIds.every((id, index) => id === normalizedIds[index])
      );
    }) || null
  );
}

/**
 * Creates a human-readable duration label for the dosage cards and print view.
 * @param {number} duration - Duration in minutes.
 * @returns {string} Formatted duration label.
 */
export function formatDurationLabel(duration) {
  if (duration < 60) {
    return `${duration}m`;
  }

  return `${(duration / 60).toFixed(1)}h`;
}
