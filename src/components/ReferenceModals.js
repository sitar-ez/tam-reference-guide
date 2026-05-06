import { useState } from "react";

import {
  C,
  SOURCES,
  SUBSTANCE_SOURCE_MAP,
} from "../data/referenceData";

/**
 * Modal overlay showing academic references for the current selection.
 * @param {object} props - Component props.
 * @returns {JSX.Element} Rendered modal.
 */
export function SourcesModal({ sourceIds, onClose }) {
  const sources = sourceIds
    .map((id) => ({ id, ...SOURCES[id] }))
    .filter((source) => source.title);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          background: C.surface,
          borderRadius: 16,
          padding: 26,
          maxWidth: 600,
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              color: C.tealSoft,
              fontFamily: "'Merriweather', serif",
              margin: 0,
              fontSize: 18,
            }}
          >
            References & Sources
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: C.greyDim,
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
        {sources.map((source, index) => (
          <div
            key={source.id}
            style={{
              marginBottom: 12,
              padding: "13px 14px",
              background: C.bg,
              borderRadius: 10,
              borderLeft: `3px solid ${C.teal}`,
            }}
          >
            <div
              style={{
                color: C.white,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 4,
                fontFamily: "'Merriweather', serif",
              }}
            >
              [{index + 1}] {source.title}
            </div>
            <div
              style={{
                color: C.grey,
                fontSize: 12,
                marginBottom: 5,
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
                fontSize: 11,
                wordBreak: "break-all",
                fontFamily: "'Merriweather Sans', sans-serif",
              }}
            >
              {source.url}
            </a>
          </div>
        ))}
        <div
          style={{
            marginTop: 14,
            padding: 12,
            background: C.surfaceLight,
            borderRadius: 8,
          }}
        >
          <p
            style={{
              color: C.greyDim,
              fontSize: 11,
              margin: 0,
              lineHeight: 1.6,
              fontFamily: "'Merriweather Sans', sans-serif",
            }}
          >
            All information is derived from published peer-reviewed scientific
            literature or primary sources. No information is generated without a
            verified source.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal showing all references across the guide, organized by substance.
 * @param {object} props - Component props.
 * @returns {JSX.Element} Rendered modal.
 */
export function AllReferencesModal({ substances, combinations, onClose }) {
  const [activeId, setActiveId] = useState(null);
  const allItems = [...substances, ...combinations];
  const activeItem = activeId ? allItems.find((item) => item.id === activeId) : null;
  const sourceIds = activeId ? SUBSTANCE_SOURCE_MAP[activeId] || [] : [];
  const sources = sourceIds
    .map((id) => ({ id, ...SOURCES[id] }))
    .filter((source) => source.title);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 110,
        padding: 20,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          background: C.surface,
          borderRadius: 16,
          padding: 26,
          maxWidth: 640,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              color: C.tealSoft,
              fontFamily: "'Merriweather', serif",
              margin: 0,
              fontSize: 18,
            }}
          >
            {activeItem ? (
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setActiveId(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: C.teal,
                    cursor: "pointer",
                    fontSize: 18,
                    padding: 0,
                  }}
                >
                  ←
                </button>
                {activeItem.name}
              </span>
            ) : (
              "All References & Sources"
            )}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: C.greyDim,
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {!activeItem ? (
          <>
            <p
              style={{
                color: C.greyDim,
                fontSize: 12,
                marginBottom: 16,
                fontFamily: "'Merriweather Sans', sans-serif",
              }}
            >
              Select a molecule to view all its references and sources.
            </p>
            <div style={{ marginBottom: 12 }}>
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
                      padding: "10px 8px",
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
                      {(SUBSTANCE_SOURCE_MAP[substance.id] || []).length} sources
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
                  marginTop: 16,
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
                      {(SUBSTANCE_SOURCE_MAP[combination.id] || []).length} sources
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            {sources.length === 0 ? (
              <p
                style={{
                  color: C.greyDim,
                  fontFamily: "'Merriweather Sans', sans-serif",
                }}
              >
                No sources found.
              </p>
            ) : (
              sources.map((source, index) => (
                <div
                  key={source.id}
                  style={{
                    marginBottom: 12,
                    padding: "13px 14px",
                    background: C.bg,
                    borderRadius: 10,
                    borderLeft: `3px solid ${C.teal}`,
                  }}
                >
                  <div
                    style={{
                      color: C.white,
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 4,
                      fontFamily: "'Merriweather', serif",
                    }}
                  >
                    [{index + 1}] {source.title}
                  </div>
                  <div
                    style={{
                      color: C.grey,
                      fontSize: 12,
                      marginBottom: 5,
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
                      fontSize: 11,
                      wordBreak: "break-all",
                      fontFamily: "'Merriweather Sans', sans-serif",
                    }}
                  >
                    {source.url}
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
