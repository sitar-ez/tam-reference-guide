import { useMemo, useState } from "react";

import { C } from "../data/referenceData";
import {
  filterSubstances,
  GRID_CATEGORY_OPTIONS,
} from "../utils/referenceUtils";

/**
 * Tabbed selector for substances and combinations, with search and category
 * filters for the single-substance grid.
 *
 * @param {object} props - Component props.
 * @returns {JSX.Element} Rendered selector grid.
 */
export default function SubstanceGrid({
  substances,
  combinations,
  selected,
  onSelect,
}) {
  const [tab, setTab] = useState("substances");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredSubstances = useMemo(
    () => filterSubstances(substances, searchQuery, categoryFilter),
    [categoryFilter, searchQuery, substances]
  );

  const tabButton = (active, label, onClick) => (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "9px 0",
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'Merriweather Sans', sans-serif",
        background: active ? C.teal : "transparent",
        color: active ? C.bg : C.greyDim,
        border: "none",
        cursor: "pointer",
        borderRadius: 8,
        transition: "all 0.18s ease",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        marginTop: 20,
        background: C.surface,
        borderRadius: 16,
        padding: 18,
        border: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          background: C.bg,
          borderRadius: 10,
          padding: 4,
        }}
      >
        {tabButton(tab === "substances", "Single Substances", () => setTab("substances"))}
        {tabButton(tab === "combinations", "Combinations", () => setTab("combinations"))}
      </div>

      {tab === "substances" ? (
        <>
          <div style={{ marginBottom: 12 }}>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by molecule or category..."
              style={{
                width: "100%",
                padding: "11px 12px",
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                color: C.white,
                fontSize: 13,
                boxSizing: "border-box",
                fontFamily: "'Merriweather Sans', sans-serif",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 4,
              marginBottom: 14,
            }}
          >
            {GRID_CATEGORY_OPTIONS.map((option) => {
              const isActive = categoryFilter === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setCategoryFilter(option.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: `1px solid ${isActive ? C.teal : C.border}`,
                    background: isActive ? `${C.teal}22` : C.surfaceLight,
                    color: isActive ? C.tealSoft : C.greyDim,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontFamily: "'Merriweather Sans', sans-serif",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {filteredSubstances.length === 0 ? (
            <div
              style={{
                padding: "28px 18px",
                borderRadius: 12,
                background: C.bg,
                color: C.greyDim,
                textAlign: "center",
                fontSize: 13,
                fontFamily: "'Merriweather Sans', sans-serif",
              }}
            >
              No molecules match that search or filter.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
              }}
            >
              {filteredSubstances.map((substance) => {
                const isSelected = selected?.id === substance.id;
                return (
                  <button
                    key={substance.id}
                    onClick={() => onSelect(substance)}
                    style={{
                      padding: "11px 8px",
                      background: isSelected ? C.teal : C.surfaceLight,
                      color: isSelected ? C.bg : C.tealSoft,
                      border: `1px solid ${isSelected ? C.teal : C.border}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: isSelected ? 700 : 500,
                      fontFamily: "'Merriweather Sans', sans-serif",
                      textAlign: "center",
                      lineHeight: 1.25,
                      transition: "all 0.15s ease",
                      boxShadow: isSelected ? `0 0 14px ${C.teal}66` : "none",
                    }}
                  >
                    <div>{substance.name}</div>
                    <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3 }}>
                      {substance.category}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {combinations.map((combination) => {
            const isSelected = selected?.id === combination.id;
            const componentNames = combination.components
              .map((id) => substances.find((substance) => substance.id === id)?.name)
              .join(" + ");

            return (
              <button
                key={combination.id}
                onClick={() => onSelect(combination)}
                style={{
                  padding: "13px 16px",
                  background: isSelected ? C.tealSat : C.surfaceLight,
                  color: isSelected ? C.bg : C.tealSoft,
                  border: `1px solid ${isSelected ? C.tealSat : C.border}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  fontFamily: "'Merriweather Sans', sans-serif",
                  textAlign: "left",
                  lineHeight: 1.3,
                  transition: "all 0.15s ease",
                  boxShadow: isSelected ? `0 0 14px ${C.tealSat}55` : "none",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
                  {combination.name}
                </div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{componentNames}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
