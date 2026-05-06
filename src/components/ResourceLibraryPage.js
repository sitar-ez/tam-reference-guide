import { useState } from "react";

import {
  C,
  COMBINATIONS,
  SOURCES,
  SUBSTANCES,
  SUBSTANCE_SOURCE_MAP,
} from "../data/referenceData";

/**
 * Accordion list of all sources organized by substance.
 * @returns {JSX.Element} Rendered resource library page.
 */
export default function ResourceLibraryPage() {
  const [openId, setOpenId] = useState(null);
  const bySubstance = Object.entries(SUBSTANCE_SOURCE_MAP)
    .map(([id, sourceIds]) => {
      const substance = [...SUBSTANCES, ...COMBINATIONS].find((item) => item.id === id);
      const sources = sourceIds.map((sourceId) => SOURCES[sourceId]).filter(Boolean);
      return { id, name: substance?.name || id, sources };
    })
    .filter((entry) => entry.sources.length > 0);

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            color: C.white,
            fontSize: 16,
            fontFamily: "'Merriweather', serif",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          References & Sources
        </div>
        <div
          style={{
            color: C.greyDim,
            fontSize: 12,
            fontFamily: "'Merriweather Sans', sans-serif",
            lineHeight: 1.6,
          }}
        >
          All sources used in this guide, organized by substance.
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {bySubstance.map(({ id, name, sources }) => (
          <div
            key={id}
            style={{
              background: C.surface,
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpenId(openId === id ? null : id)}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "'Merriweather Sans', sans-serif",
              }}
            >
              <span style={{ color: C.white, fontSize: 14, fontWeight: 600 }}>
                {name}
              </span>
              <span style={{ color: C.teal, fontSize: 12 }}>
                {sources.length} source{sources.length !== 1 ? "s" : ""}{" "}
                {openId === id ? "▲" : "▼"}
              </span>
            </button>
            {openId === id && (
              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  padding: "12px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {sources.map((source, index) => (
                  <div
                    key={`${id}-${index}`}
                    style={{
                      paddingLeft: 12,
                      borderLeft: `3px solid ${C.teal}44`,
                    }}
                  >
                    <div
                      style={{
                        color: C.white,
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "'Merriweather', serif",
                        marginBottom: 2,
                      }}
                    >
                      {source.title}
                    </div>
                    <div
                      style={{
                        color: C.greyDim,
                        fontSize: 11,
                        fontFamily: "'Merriweather Sans', sans-serif",
                        marginBottom: 3,
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
                        fontFamily: "'Merriweather Sans', sans-serif",
                        wordBreak: "break-all",
                      }}
                    >
                      {source.url} ↗
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
