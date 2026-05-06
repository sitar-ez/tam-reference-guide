import { useMemo, useState } from "react";

import { C } from "../data/referenceData";
import { findCombinationByComponents } from "../utils/referenceUtils";

/**
 * Prominent lookup tool for the existing combination data set.
 * Users can choose two or three substances to see whether the guide already
 * contains a named combination profile.
 *
 * @param {object} props - Component props.
 * @returns {JSX.Element} Rendered interaction checker.
 */
export default function InteractionChecker({
  substances,
  combinations,
  selected,
  onSelect,
}) {
  const [selection, setSelection] = useState({
    first: "",
    second: "",
    third: "",
  });

  const selectedIds = [selection.first, selection.second, selection.third].filter(Boolean);
  const matchingCombination = useMemo(
    () => findCombinationByComponents(combinations, selectedIds),
    [combinations, selectedIds]
  );

  const isDuplicateSelection = new Set(selectedIds).size !== selectedIds.length;
  const substanceOptions = substances.map((substance) => (
    <option key={substance.id} value={substance.id}>
      {substance.name}
    </option>
  ));

  return (
    <div
      style={{
        margin: "14px 0 0",
        background: C.surface,
        borderRadius: 16,
        padding: 20,
        border: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          color: C.greyDim,
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontFamily: "'Merriweather Sans', sans-serif",
          marginBottom: 10,
        }}
      >
        Drug Interaction Checker
      </div>
      <p
        style={{
          margin: "0 0 14px",
          color: C.greyDim,
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily: "'Merriweather Sans', sans-serif",
        }}
      >
        Look up the guide&apos;s named combination entries by selecting two or
        three molecules.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginBottom: 14,
        }}
      >
        {[
          { key: "first", label: "Substance 1" },
          { key: "second", label: "Substance 2" },
          { key: "third", label: "Optional 3rd" },
        ].map((field) => (
          <div key={field.key}>
            <div style={fieldLabelStyle}>{field.label}</div>
            <select
              value={selection[field.key]}
              onChange={(event) =>
                setSelection((current) => ({
                  ...current,
                  [field.key]: event.target.value,
                }))
              }
              style={selectStyle}
            >
              <option value="">{field.key === "third" ? "None" : "Select..."}</option>
              {substanceOptions}
            </select>
          </div>
        ))}
      </div>

      {isDuplicateSelection ? (
        <div style={messageCardStyle}>
          Choose different substances in each field to check a combination.
        </div>
      ) : matchingCombination ? (
        <div
          style={{
            ...messageCardStyle,
            borderLeft: `3px solid ${C.tealSat}`,
            background: `${C.tealSat}12`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <div>
              <div
                style={{
                  color: C.tealSoft,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'Merriweather Sans', sans-serif",
                  marginBottom: 4,
                }}
              >
                {matchingCombination.name}
              </div>
              <div
                style={{
                  color: C.greyDim,
                  fontSize: 12,
                  lineHeight: 1.6,
                  fontFamily: "'Merriweather Sans', sans-serif",
                }}
              >
                {matchingCombination.description}
              </div>
            </div>
            <button
              onClick={() => onSelect(matchingCombination)}
              style={{
                padding: "9px 12px",
                background: selected?.id === matchingCombination.id ? C.tealSat : C.teal,
                border: "none",
                borderRadius: 10,
                color: C.bg,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "'Merriweather Sans', sans-serif",
              }}
            >
              Open Reference
            </button>
          </div>
          <div style={timingStyle}>
            <strong style={{ color: C.tealSoft }}>Timing:</strong>{" "}
            <span>{matchingCombination.timing}</span>
          </div>
        </div>
      ) : selectedIds.length >= 2 ? (
        <div style={messageCardStyle}>
          No named combination entry is stored for that exact set yet. You can
          still review the individual substance references above.
        </div>
      ) : (
        <div style={messageCardStyle}>
          Pick at least two substances to check whether this guide has a stored
          combination profile.
        </div>
      )}
    </div>
  );
}

const fieldLabelStyle = {
  color: C.greyDim,
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontFamily: "'Merriweather Sans', sans-serif",
  marginBottom: 6,
};

const selectStyle = {
  width: "100%",
  padding: "10px 12px",
  background: C.bg,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  color: C.white,
  fontSize: 13,
  boxSizing: "border-box",
  fontFamily: "'Merriweather Sans', sans-serif",
};

const messageCardStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  background: C.bg,
  color: C.greyDim,
  borderLeft: `3px solid ${C.teal}55`,
  fontSize: 12,
  lineHeight: 1.6,
  fontFamily: "'Merriweather Sans', sans-serif",
};

const timingStyle = {
  padding: "10px 12px",
  background: C.bg,
  borderRadius: 8,
  color: C.greyDim,
  fontSize: 12,
  lineHeight: 1.6,
  fontFamily: "'Merriweather Sans', sans-serif",
};
