import { useState } from "react";

import { C, SOURCES } from "../data/referenceData";

/**
 * Full-page component for the "Descriptions + History" tab.
 * @param {object} props - Component props.
 * @returns {JSX.Element} Rendered history page.
 */
export default function HistoryPage({ substances, combinations }) {
  const [activeId, setActiveId] = useState(null);
  const allItems = [...substances, ...combinations];
  const activeItem = activeId ? allItems.find((item) => item.id === activeId) : null;

  return (
    <div style={{ paddingBottom: 40 }}>
      {activeItem ? (
        <>
          <button
            onClick={() => setActiveId(null)}
            style={{
              background: C.surface,
              border: `1px solid ${C.teal}66`,
              color: C.teal,
              cursor: "pointer",
              fontSize: 14,
              padding: "9px 16px",
              borderRadius: 8,
              fontFamily: "'Merriweather Sans', sans-serif",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 18,
              fontWeight: 600,
            }}
          >
            ← Back to all medicines
          </button>
          <h2
            style={{
              color: C.tealSoft,
              fontFamily: "'Merriweather', serif",
              margin: "0 0 10px",
              fontSize: 22,
            }}
          >
            {activeItem.name}
          </h2>
          <div
            style={{
              marginBottom: 14,
              padding: "6px 12px",
              background: `${C.teal}18`,
              borderRadius: 8,
              display: "inline-block",
            }}
          >
            <span
              style={{
                color: C.teal,
                fontSize: 11,
                fontFamily: "'Merriweather Sans', sans-serif",
              }}
            >
              {activeItem.isCombination ? "Combination" : activeItem.category}
            </span>
          </div>
          <p
            style={{
              color: C.grey,
              fontSize: 14,
              lineHeight: 1.85,
              fontFamily: "'Merriweather', serif",
              fontWeight: 300,
              margin: "0 0 20px",
            }}
          >
            {activeItem.history ||
              activeItem.description ||
              "No history available for this entry."}
          </p>
          {(activeItem.historySources || []).length > 0 && (
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
              <div
                style={{
                  color: C.greyDim,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                  fontFamily: "'Merriweather Sans', sans-serif",
                }}
              >
                Sources for This History
              </div>
              {(activeItem.historySources || []).map((id) => {
                const source = SOURCES[id];
                if (!source) return null;

                return (
                  <div
                    key={id}
                    style={{
                      marginBottom: 10,
                      padding: "10px 12px",
                      background: C.bg,
                      borderRadius: 8,
                      borderLeft: `3px solid ${C.teal}55`,
                    }}
                  >
                    <div
                      style={{
                        color: C.white,
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 3,
                        fontFamily: "'Merriweather', serif",
                      }}
                    >
                      {source.title}
                    </div>
                    <div
                      style={{
                        color: C.grey,
                        fontSize: 11,
                        marginBottom: 4,
                        fontFamily: "'Merriweather Sans', sans-serif",
                      }}
                    >
                      {source.authors} — <em>{source.journal}</em>, {source.year}
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: C.teal,
                        fontSize: 10,
                        wordBreak: "break-all",
                        fontFamily: "'Merriweather Sans', sans-serif",
                      }}
                    >
                      {source.url}
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <h2
            style={{
              color: C.tealSoft,
              fontFamily: "'Merriweather', serif",
              margin: "0 0 6px",
              fontSize: 20,
            }}
          >
            Medicine Descriptions & History
          </h2>
          <p
            style={{
              color: C.greyDim,
              fontSize: 12,
              marginBottom: 20,
              fontFamily: "'Merriweather Sans', sans-serif",
              lineHeight: 1.6,
            }}
          >
            Select a medicine to read its description and history — from ancient
            ceremonial roots to modern clinical research.
          </p>
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                color: C.greyDim,
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 10,
                fontFamily: "'Merriweather Sans', sans-serif",
              }}
            >
              Single Substances
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
              }}
            >
              {substances.map((substance) => (
                <button
                  key={substance.id}
                  onClick={() => setActiveId(substance.id)}
                  style={{
                    padding: "12px 8px",
                    background: C.surfaceLight,
                    color: C.tealSoft,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "'Merriweather Sans', sans-serif",
                    textAlign: "center",
                    lineHeight: 1.25,
                    transition: "all 0.15s",
                  }}
                >
                  <div>{substance.name}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3 }}>
                    {substance.category}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                color: C.greyDim,
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 10,
                fontFamily: "'Merriweather Sans', sans-serif",
              }}
            >
              Combinations
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {combinations.map((combination) => (
                <button
                  key={combination.id}
                  onClick={() => setActiveId(combination.id)}
                  style={{
                    padding: "12px 14px",
                    background: C.surfaceLight,
                    color: C.tealSoft,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    fontFamily: "'Merriweather Sans', sans-serif",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
                    {combination.name}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.65 }}>
                    {combination.components
                      .map(
                        (id) =>
                          substances.find((substance) => substance.id === id)?.name
                      )
                      .join(" + ")}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
