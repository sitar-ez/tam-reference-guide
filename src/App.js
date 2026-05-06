import { useState } from "react";

import DoseSlider from "./components/DoseSlider";
import HistoryPage from "./components/HistoryPage";
import IntensityGraph from "./components/IntensityGraph";
import InteractionChecker from "./components/InteractionChecker";
import { AllReferencesModal, SourcesModal } from "./components/ReferenceModals";
import ResourceLibraryPage from "./components/ResourceLibraryPage";
import SubstanceGrid from "./components/SubstanceGrid";
import TripReportsPage from "./components/TripReportsPage";
import { APP_VERSION } from "./constants/appMeta";
import {
  C,
  COMBINATIONS,
  KETAMINE_ROAS,
  MEO_SOURCES,
  SUBSTANCES,
} from "./data/referenceData";
import {
  formatDurationLabel,
  getDoseCategory,
  getDoseCategoryLabel,
} from "./utils/referenceUtils";
import { printDosageReference } from "./utils/printReference";

const SECTION_LABEL_STYLE = {
  color: C.greyDim,
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontFamily: "'Merriweather Sans', sans-serif",
  marginBottom: 14,
};

/**
 * Root application component.
 * @returns {JSX.Element} Main application UI.
 */
export default function App() {
  const [activePage, setActivePage] = useState("dosages");
  const [selected, setSelected] = useState(SUBSTANCES[0]);
  const [dose, setDose] = useState(SUBSTANCES[0].doses.moderate);
  const [comboDoses, setComboDoses] = useState({});
  const [showSources, setShowSources] = useState(false);
  const [showAllRefs, setShowAllRefs] = useState(false);
  const [booster, setBooster] = useState({ enabled: false, time: 60, dose: 0 });
  const [selectedRoa, setSelectedRoa] = useState("lozenge");
  const [selectedMeoSource, setSelectedMeoSource] = useState("synthetic");

  const isCombination = Boolean(selected?.isCombination);
  const isKetamine = Boolean(selected?.isKetamine);
  const isFiveMeO = Boolean(selected?.is5MeO);
  const roaData = isKetamine ? KETAMINE_ROAS[selectedRoa] : null;
  const meoData = isFiveMeO ? MEO_SOURCES[selectedMeoSource] : null;
  const activeSrc = meoData || roaData || selected;
  const activeDoses = activeSrc?.doses;
  const activeUnit = activeSrc?.unit;
  const comboSubstances = isCombination
    ? selected.components
        .map((id) => SUBSTANCES.find((substance) => substance.id === id))
        .filter(Boolean)
    : [];

  /**
   * Handles a new substance or combination selection.
   * @param {object} item - Selected entry from the grid.
   */
  const handleSelect = (item) => {
    setSelected(item);

    if (item.isCombination) {
      const defaults = {};
      item.components.forEach((id) => {
        const substance = SUBSTANCES.find((entry) => entry.id === id);
        if (substance) {
          defaults[substance.id] = substance.doses.moderate;
        }
      });
      setComboDoses(defaults);
      return;
    }

    const sourceDoses = item.is5MeO
      ? MEO_SOURCES[selectedMeoSource].doses
      : item.isKetamine
        ? KETAMINE_ROAS[selectedRoa].doses
        : item.doses;
    const sourceTiming = item.is5MeO
      ? MEO_SOURCES[selectedMeoSource]
      : item.isKetamine
        ? KETAMINE_ROAS[selectedRoa]
        : item;

    setDose(sourceDoses.moderate);
    setBooster((current) => ({
      ...current,
      dose: sourceDoses.light,
      time: Math.round(sourceTiming.peak * 0.5),
    }));
  };

  /**
   * Resets ketamine state for a new route of administration.
   * @param {string} roaId - Newly selected ketamine route id.
   */
  const handleRoaChange = (roaId) => {
    setSelectedRoa(roaId);
    const roa = KETAMINE_ROAS[roaId];
    setDose(roa.doses.moderate);
    setBooster((current) => ({
      ...current,
      dose: roa.doses.light,
      time: Math.round(roa.peak * 0.5),
    }));
  };

  /**
   * Resets 5-MeO-DMT state for a new source profile.
   * @param {string} sourceId - Newly selected source id.
   */
  const handleMeoSourceChange = (sourceId) => {
    setSelectedMeoSource(sourceId);
    const source = MEO_SOURCES[sourceId];
    setDose(source.doses.moderate);
    setBooster((current) => ({
      ...current,
      dose: source.doses.light,
      time: Math.round(source.peak * 0.5),
    }));
  };

  const allSourceIds = [
    ...new Set([
      ...(selected?.sources || []),
      ...(roaData?.sources || []),
      ...(meoData?.sources || []),
    ]),
  ];
  const effectsCategory = !isCombination
    ? getDoseCategory(activeDoses || selected.doses, dose)
    : "moderate";
  const currentEffects = !isCombination
    ? (activeSrc.effects[effectsCategory] || activeSrc.effects.moderate)
    : null;
  const doseLabel = !isCombination
    ? getDoseCategoryLabel(activeDoses || selected.doses, dose)
    : null;
  const doseStep = activeDoses
    ? Math.max(0.001, (activeDoses.heavy * 1.5) / 200)
    : 1;
  const boosterStep = activeDoses
    ? Math.max(0.001, activeDoses.moderate / 100)
    : 1;
  const safetyNotes =
    isKetamine && roaData
      ? [...selected.safety, ...roaData.safety]
      : isFiveMeO && meoData
        ? meoData.safety
        : selected.safety;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.white,
        fontFamily: "'Merriweather Sans', sans-serif",
        paddingBottom: 60,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Merriweather+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{ background: "#f5f3ef", borderBottom: "1px solid #ddd", padding: "14px 20px" }}>
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 14,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src="https://tamintegration.com/wp-content/uploads/2021/11/cropped-tam-logo-clear.png"
              alt="Tam Integration"
              style={{ height: 52, width: "auto", flexShrink: 0 }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Merriweather', serif",
                  fontWeight: 700,
                  color: "#1a2a3a",
                  marginBottom: 2,
                  fontSize: "clamp(15px,3.5vw,20px)",
                  letterSpacing: "0.02em",
                }}
              >
                Tam Integration
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(12px,2.5vw,14px)",
                  fontWeight: 400,
                  fontFamily: "'Merriweather', serif",
                  fontStyle: "italic",
                  color: "#3a4a5a",
                  lineHeight: 1.35,
                }}
              >
                Guide to Popular Molecules
              </h1>
              <p
                style={{
                  margin: "3px 0 0",
                  color: "#5a6a7a",
                  fontSize: 11,
                  fontFamily: "'Merriweather Sans', sans-serif",
                }}
              >
                Evidence-based psychedelic substance reference
              </p>
            </div>
          </div>
          <div
            style={{
              padding: "7px 10px",
              borderRadius: 999,
              background: "#e6ecef",
              color: "#355165",
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            v{APP_VERSION}
          </div>
        </div>
      </div>

      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 16px" }}>
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8,
          }}
        >
          {[
            { id: "dosages", label: "Dosages + Effects", emoji: "⚗️" },
            { id: "history", label: "Descriptions + History", emoji: "📜" },
            { id: "library", label: "Resource Library", emoji: "📚" },
            { id: "reports", label: "Trip Reports", emoji: "📝" },
          ].map(({ id, label, emoji }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                style={{
                  padding: "10px 6px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: isActive ? C.teal : C.surfaceLight,
                  color: isActive ? C.bg : C.greyDim,
                  border: `1px solid ${isActive ? C.teal : C.border}`,
                  fontSize: "clamp(10px, 2.2vw, 13px)",
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: "'Merriweather Sans', sans-serif",
                  transition: "all 0.15s ease",
                  boxShadow: isActive ? `0 0 12px ${C.teal}44` : "none",
                  lineHeight: 1.3,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "clamp(14px, 3vw, 18px)", marginBottom: 3 }}>
                  {emoji}
                </div>
                <div>{label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 16px 0" }}>
        {activePage === "library" && <ResourceLibraryPage />}
        {activePage === "reports" && (
          <TripReportsPage substances={SUBSTANCES} combinations={COMBINATIONS} />
        )}
        {activePage === "history" && (
          <HistoryPage substances={SUBSTANCES} combinations={COMBINATIONS} />
        )}

        {activePage === "dosages" && (
          <>
            <SubstanceGrid
              substances={SUBSTANCES}
              combinations={COMBINATIONS}
              selected={selected}
              onSelect={handleSelect}
            />

            <InteractionChecker
              substances={SUBSTANCES}
              combinations={COMBINATIONS}
              selected={selected}
              onSelect={handleSelect}
            />

            {selected && (
              <>
                <div
                  style={{
                    margin: "18px 0 0",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 13px",
                      borderRadius: 20,
                      background: isCombination ? `${C.tealSat}22` : `${C.teal}22`,
                      color: isCombination ? C.tealSat : C.teal,
                      fontSize: 11,
                    }}
                  >
                    {isCombination ? "Combination" : activeSrc.category || selected.category}
                  </span>
                  <span
                    style={{
                      color: C.white,
                      fontSize: 17,
                      fontWeight: 700,
                      fontFamily: "'Merriweather', serif",
                    }}
                  >
                    {selected.name}
                  </span>
                </div>

                {isCombination && (
                  <div
                    style={{
                      margin: "12px 0 0",
                      padding: 16,
                      background: C.surface,
                      borderRadius: 12,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 12px",
                        color: C.grey,
                        fontSize: 13,
                        lineHeight: 1.7,
                        fontFamily: "'Merriweather', serif",
                        fontWeight: 300,
                      }}
                    >
                      {selected.description}
                    </p>
                    <div style={{ padding: "10px 12px", background: C.bg, borderRadius: 8 }}>
                      <span
                        style={{
                          color: C.teal,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        TIMING:{" "}
                      </span>
                      <span
                        style={{
                          color: C.greyDim,
                          fontSize: 12,
                          fontFamily: "'Merriweather Sans', sans-serif",
                        }}
                      >
                        {selected.timing}
                      </span>
                    </div>
                  </div>
                )}

                {isKetamine && (
                  <SelectionPanel
                    title="Route of Administration"
                    items={Object.values(KETAMINE_ROAS)}
                    activeId={selectedRoa}
                    onSelect={handleRoaChange}
                    renderDescription={(item) => (
                      <div style={{ fontSize: 10, opacity: 0.75 }}>
                        Bioavailability: {item.bioavailability}
                      </div>
                    )}
                    notes={roaData?.notes}
                  />
                )}

                {isFiveMeO && (
                  <SelectionPanel
                    title="Source / Preparation"
                    items={Object.values(MEO_SOURCES)}
                    activeId={selectedMeoSource}
                    onSelect={handleMeoSourceChange}
                    notes={meoData?.notes}
                  />
                )}

                <div
                  style={{
                    margin: "14px 0 0",
                    background: C.surface,
                    borderRadius: 16,
                    padding: 20,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div style={SECTION_LABEL_STYLE}>
                    {isCombination ? "Component Dosages" : "Dosage"}
                  </div>
                  {isCombination ? (
                    comboSubstances.map((substance) => {
                      const componentDose =
                        comboDoses[substance.id] ?? substance.doses.moderate;
                      const componentDoseLabel = getDoseCategoryLabel(
                        substance.doses,
                        componentDose
                      );
                      const componentStep = Math.max(
                        0.001,
                        (substance.doses.heavy * 1.5) / 200
                      );
                      return (
                        <div key={substance.id} style={{ marginBottom: 20 }}>
                          <div
                            style={{
                              color: C.tealSoft,
                              fontSize: 13,
                              fontWeight: 600,
                              marginBottom: 8,
                            }}
                          >
                            {substance.name}
                          </div>
                          <DoseSlider
                            label={substance.name}
                            value={componentDose}
                            min={0}
                            max={substance.doses.heavy * 1.5}
                            step={componentStep}
                            unit={substance.unit}
                            onChange={(value) =>
                              setComboDoses((current) => ({
                                ...current,
                                [substance.id]: value,
                              }))
                            }
                            doseLabel={componentDoseLabel}
                          />
                          <DoseBand
                            leftLabel={`Light ${substance.doses.light}`}
                            centerLabel={`Mod ${substance.doses.moderate}`}
                            rightLabel={`Heavy ${substance.doses.heavy}`}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <DoseSlider
                        label="Primary Dose"
                        value={dose}
                        min={0}
                        max={(activeDoses?.heavy || 100) * 1.5}
                        step={doseStep}
                        unit={activeUnit || "mg"}
                        onChange={setDose}
                        doseLabel={doseLabel}
                      />
                      <DoseBand
                        leftLabel={`Light ${activeDoses?.light}`}
                        centerLabel={`Mod ${activeDoses?.moderate}`}
                        rightLabel={`Heavy ${activeDoses?.heavy}`}
                      />
                    </>
                  )}
                </div>

                {!isCombination && (
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
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: booster.enabled ? 16 : 0,
                      }}
                    >
                      <div>
                        <div style={SECTION_LABEL_STYLE}>Booster Dose</div>
                        {!booster.enabled && (
                          <div
                            style={{
                              color: C.greyDim,
                              fontSize: 12,
                              lineHeight: 1.5,
                              marginTop: -10,
                              maxWidth: 380,
                            }}
                          >
                            A supplemental dose taken 60–90 min in to extend or
                            deepen the experience.
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 12 }}>
                        {["Yes", "No"].map((option) => {
                          const isActive = option === "Yes" ? booster.enabled : !booster.enabled;
                          return (
                            <button
                              key={option}
                              onClick={() =>
                                setBooster((current) => ({
                                  ...current,
                                  enabled: option === "Yes",
                                }))
                              }
                              style={{
                                padding: "6px 16px",
                                borderRadius: 20,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                border: `1px solid ${isActive ? C.teal : C.border}`,
                                background: isActive ? C.teal : C.surfaceLight,
                                color: isActive ? C.bg : C.greyDim,
                              }}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {booster.enabled && (
                      <>
                        {selected.boosterInfo && (
                          <div
                            style={{
                              padding: "10px 14px",
                              background: C.bg,
                              borderRadius: 8,
                              borderLeft: `2px solid ${C.tealSat}55`,
                              marginBottom: 16,
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                color: C.greyDim,
                                fontSize: 12,
                                lineHeight: 1.6,
                              }}
                            >
                              {selected.boosterInfo}
                            </p>
                          </div>
                        )}
                        <div style={{ marginBottom: 16 }}>
                          <DoseSlider
                            label="Time after initial dose"
                            value={booster.time}
                            min={15}
                            max={Math.round(activeSrc.duration * 0.7)}
                            step={5}
                            unit="min"
                            onChange={(value) =>
                              setBooster((current) => ({ ...current, time: value }))
                            }
                            accentColor={C.tealSat}
                          />
                        </div>
                        <DoseSlider
                          label="Booster amount"
                          value={booster.dose}
                          min={0}
                          max={activeDoses?.moderate || 50}
                          step={boosterStep}
                          unit={activeUnit || "mg"}
                          onChange={(value) =>
                            setBooster((current) => ({ ...current, dose: value }))
                          }
                          accentColor={C.tealSat}
                        />
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 11,
                            color: C.greyDim,
                            paddingLeft: 68,
                          }}
                        >
                          Suggested: 25–50% of initial dose
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!isCombination && <IntensityGraph src={activeSrc} dose={dose} booster={booster} />}

                {!isCombination && (
                  <div
                    style={{
                      margin: "14px 0 0",
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: 10,
                    }}
                  >
                    {[
                      {
                        label: "Onset",
                        value:
                          activeSrc.onset < 5
                            ? `${Math.round(activeSrc.onset * 60)}s`
                            : `${activeSrc.onset}m`,
                      },
                      { label: "Peak", value: `${activeSrc.peak}m` },
                      { label: "Duration", value: formatDurationLabel(activeSrc.duration) },
                    ].map((item) => (
                      <div
                        key={item.label}
                        style={{
                          background: C.surface,
                          borderRadius: 12,
                          padding: "13px 10px",
                          textAlign: "center",
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        <div
                          style={{
                            color: C.greyDim,
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 4,
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            color: C.tealSoft,
                            fontWeight: 700,
                            fontSize: 16,
                          }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentEffects && (
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
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 14,
                      }}
                    >
                      <div style={SECTION_LABEL_STYLE}>Expected Effects</div>
                      {doseLabel && (
                        <span
                          style={{
                            padding: "3px 11px",
                            borderRadius: 12,
                            background: `${doseLabel.color}22`,
                            color: doseLabel.color,
                            fontSize: 11,
                          }}
                        >
                          {doseLabel.label}
                        </span>
                      )}
                    </div>
                    {currentEffects.map((effect) => (
                      <EffectPill key={effect} text={effect} />
                    ))}
                  </div>
                )}

                {isCombination && (
                  <div
                    style={{
                      margin: "14px 0 0",
                      background: C.surface,
                      borderRadius: 16,
                      padding: 20,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div style={SECTION_LABEL_STYLE}>Key Effects by Component</div>
                    {comboSubstances.map((substance) => {
                      const componentDose = comboDoses[substance.id] ?? substance.doses.moderate;
                      const componentCategory = getDoseCategory(substance.doses, componentDose);
                      const effects = substance.effects[componentCategory] || substance.effects.moderate;
                      return (
                        <div key={substance.id} style={{ marginBottom: 18 }}>
                          <div
                            style={{
                              color: C.tealSoft,
                              fontSize: 12,
                              fontWeight: 700,
                              marginBottom: 8,
                            }}
                          >
                            {substance.name}
                          </div>
                          {effects.slice(0, 3).map((effect) => (
                            <EffectPill key={`${substance.id}-${effect}`} text={effect} compact />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div
                  style={{
                    margin: "14px 0 0",
                    background: "#160e00",
                    borderRadius: 16,
                    padding: 20,
                    border: "1px solid #3d2800",
                  }}
                >
                  <div style={{ ...SECTION_LABEL_STYLE, color: C.warning }}>
                    ⚠ Safety Considerations
                  </div>
                  {safetyNotes.map((note) => (
                    <div
                      key={note}
                      style={{
                        padding: "10px 12px",
                        background: "rgba(245,158,11,0.07)",
                        borderRadius: 8,
                        borderLeft: "3px solid #f59e0b",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          color: "#fcd34d",
                          fontSize: 13,
                          lineHeight: 1.5,
                        }}
                      >
                        {note}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() =>
                    printDosageReference({
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
                    })
                  }
                  style={actionButtonStyle(`${C.white}08`, `${C.white}24`, C.white)}
                >
                  🖨️ Print / Export PDF
                </button>
                <button
                  onClick={() => setShowSources(true)}
                  style={actionButtonStyle(`${C.teal}18`, `${C.teal}55`, C.teal)}
                >
                  📚 View Sources & References ({allSourceIds.length})
                </button>
                <button
                  onClick={() => setShowAllRefs(true)}
                  style={actionButtonStyle(`${C.tealSoft}12`, `${C.tealSoft}44`, C.tealSoft, 8)}
                >
                  📖 View All References & Sources
                </button>
              </>
            )}
          </>
        )}
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            margin: "28px 0 0",
            background: C.surface,
            borderRadius: 16,
            padding: 22,
            border: `1px solid ${C.border}`,
          }}
        >
          <div style={{ ...SECTION_LABEL_STYLE, color: C.tealSoft }}>Important Disclaimer</div>
          <p
            style={{
              color: C.greyDim,
              fontSize: 12,
              lineHeight: 1.8,
              margin: "0 0 12px",
            }}
          >
            <strong style={{ color: C.grey }}>This is not therapy.</strong> This is a
            service for healthy individuals who are looking for additional
            resources to support their growth. This is <strong style={{ color: C.grey }}>NOT</strong>{" "}
            intended to be group therapy nor any form of professional therapeutic
            intervention.
          </p>
          <div style={{ borderTop: `1px solid ${C.border}`, margin: "12px 0" }} />
          <p style={{ color: C.greyDim, fontSize: 12, lineHeight: 1.8, margin: 0 }}>
            We don&apos;t encourage or condone any illegal activities. Do not come to
            the group looking to purchase, sell, share or use of any illegal
            substances. Don&apos;t share information about illegal activities. You may
            be asked to leave if you do not adhere to this request. Thank you for
            making sure that our group stays safe for everyone.
          </p>
        </div>

        <div style={{ margin: "16px 0 0", textAlign: "center", padding: "18px 0 8px" }}>
          <p style={{ margin: "0 0 6px", color: C.greyDim, fontSize: 12 }}>
            © {new Date().getFullYear()} Tam Integration. All rights reserved.
          </p>
          <p style={{ margin: "0 0 6px", color: C.greyDim, fontSize: 12 }}>
            Version {APP_VERSION}
          </p>
          <p style={{ margin: 0, color: C.greyDim, fontSize: 12 }}>
            To learn more about Tam Integration, visit{" "}
            <a
              href="https://tamintegration.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: C.teal,
                textDecoration: "none",
                borderBottom: `1px solid ${C.teal}55`,
              }}
            >
              tamintegration.com
            </a>
          </p>
        </div>
      </div>

      {showSources && (
        <SourcesModal sourceIds={allSourceIds} onClose={() => setShowSources(false)} />
      )}
      {showAllRefs && (
        <AllReferencesModal
          substances={SUBSTANCES}
          combinations={COMBINATIONS}
          onClose={() => setShowAllRefs(false)}
        />
      )}
    </div>
  );
}

/**
 * Shared selection panel for ketamine routes and 5-MeO source profiles.
 * @param {object} props - Panel props.
 * @returns {JSX.Element} Rendered panel.
 */
function SelectionPanel({ title, items, activeId, onSelect, renderDescription, notes }) {
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
      <div style={SECTION_LABEL_STYLE}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "pointer",
                background: isActive ? C.teal : C.surfaceLight,
                color: isActive ? C.bg : C.tealSoft,
                border: `1px solid ${isActive ? C.teal : C.border}`,
                textAlign: "left",
                transition: "all 0.15s",
                boxShadow: isActive ? `0 0 12px ${C.teal}55` : "none",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: renderDescription ? 2 : 0 }}>
                {item.label}
              </div>
              {renderDescription ? renderDescription(item) : null}
            </button>
          );
        })}
      </div>
      {notes && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            background: C.bg,
            borderRadius: 8,
            borderLeft: `2px solid ${C.teal}55`,
          }}
        >
          <p style={{ margin: 0, color: C.greyDim, fontSize: 12, lineHeight: 1.6 }}>
            {notes}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Compact left/right label band used under sliders.
 * @param {object} props - Label props.
 * @returns {JSX.Element} Rendered label band.
 */
function DoseBand({ leftLabel, centerLabel, rightLabel }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 10,
        color: C.greyDim,
        marginTop: 6,
        paddingLeft: 68,
        paddingRight: 68,
      }}
    >
      <span>{leftLabel}</span>
      <span>{centerLabel}</span>
      <span>{rightLabel}</span>
    </div>
  );
}

/**
 * Shared effect row styling for both single substances and combinations.
 * @param {object} props - Effect pill props.
 * @returns {JSX.Element} Rendered effect row.
 */
function EffectPill({ text, compact = false }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: compact ? "8px 12px" : "10px 12px",
        background: C.bg,
        borderRadius: 8,
        marginBottom: 6,
        borderLeft: `2px solid ${C.teal}55`,
      }}
    >
      <span style={{ color: C.teal, fontSize: 13, marginTop: 1, flexShrink: 0 }}>◆</span>
      <span style={{ color: C.grey, fontSize: compact ? 12 : 13, lineHeight: 1.5 }}>
        {text}
      </span>
    </div>
  );
}

/**
 * Generates shared action-button styling.
 * @param {string} background - Button background color.
 * @param {string} borderColor - Button border color.
 * @param {string} textColor - Button text color.
 * @param {number} marginTop - Optional top margin.
 * @returns {object} Inline style object.
 */
function actionButtonStyle(background, borderColor, textColor, marginTop = 14) {
  return {
    margin: `${marginTop}px 0 0`,
    width: "100%",
    padding: 14,
    background,
    border: `1px solid ${borderColor}`,
    borderRadius: 12,
    color: textColor,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };
}
