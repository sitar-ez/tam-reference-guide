import { useRef, useState } from "react";

import { C } from "../data/referenceData";

/**
 * Compound slider with nudge buttons and click-to-type manual input.
 * @param {object} props - Component props.
 * @returns {JSX.Element} Rendered dose control.
 */
export default function DoseSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  accentColor,
  doseLabel,
}) {
  const accent = accentColor || C.teal;
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const nudge = (multiplier) => {
    const newValue = Math.max(
      min,
      Math.min(max, parseFloat((value + multiplier * step).toFixed(6)))
    );
    onChange(newValue);
  };

  const startEdit = () => {
    setInputValue(value.toFixed(value < 1 ? 2 : 1));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 10);
  };

  const commitEdit = () => {
    const parsedValue = parseFloat(inputValue);
    if (!Number.isNaN(parsedValue)) {
      onChange(Math.max(min, Math.min(max, parsedValue)));
    }
    setEditing(false);
  };

  const handleKey = (event) => {
    if (event.key === "Enter") commitEdit();
    if (event.key === "Escape") setEditing(false);
  };

  const buttonStyle = (size) => ({
    width: size === "lg" ? 32 : 28,
    height: 30,
    borderRadius: 8,
    border: `1px solid ${C.border}`,
    background: C.surfaceLight,
    color: C.tealSoft,
    cursor: "pointer",
    fontSize: size === "lg" ? 14 : 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.12s",
    letterSpacing: size === "sm" ? "-2px" : "0",
    fontFamily: "monospace",
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            color: C.greyDim,
            fontSize: 13,
            fontFamily: "'Merriweather Sans', sans-serif",
          }}
        >
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {doseLabel && (
            <span
              style={{
                color: doseLabel.color,
                fontSize: 11,
                fontFamily: "'Merriweather Sans', sans-serif",
              }}
            >
              {doseLabel.label}
            </span>
          )}
          {editing ? (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onBlur={commitEdit}
                onKeyDown={handleKey}
                style={{
                  width: 70,
                  background: C.surfaceLight,
                  border: `1px solid ${C.teal}`,
                  borderRadius: 6,
                  color: C.white,
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: "'Merriweather Sans', sans-serif",
                  padding: "2px 6px",
                  textAlign: "right",
                  outline: "none",
                }}
              />
              <span
                style={{
                  color: C.greyDim,
                  fontSize: 12,
                  fontFamily: "'Merriweather Sans', sans-serif",
                }}
              >
                {unit}
              </span>
            </div>
          ) : (
            <button
              onClick={startEdit}
              title="Click to type a value"
              style={{
                background: "none",
                border: "none",
                cursor: "text",
                padding: "2px 4px",
                borderRadius: 6,
                borderBottom: `1px dashed ${C.teal}44`,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  color: C.white,
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: "'Merriweather Sans', sans-serif",
                }}
              >
                {value.toFixed(value < 1 ? 2 : 1)}
              </span>
              <span
                style={{
                  color: C.greyDim,
                  fontSize: 12,
                  fontFamily: "'Merriweather Sans', sans-serif",
                }}
              >
                {unit}
              </span>
            </button>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <button onClick={() => nudge(-10)} style={buttonStyle("sm")}>
          ◀◀
        </button>
        <button onClick={() => nudge(-1)} style={buttonStyle("lg")}>
          ◀
        </button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(parseFloat(event.target.value))}
          style={{ flex: 1, accentColor: accent, cursor: "pointer" }}
        />
        <button onClick={() => nudge(1)} style={buttonStyle("lg")}>
          ▶
        </button>
        <button onClick={() => nudge(10)} style={buttonStyle("sm")}>
          ▶▶
        </button>
      </div>
    </div>
  );
}
