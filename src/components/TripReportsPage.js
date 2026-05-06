import { useState } from "react";

import { C } from "../data/referenceData";

const REPORT_STORAGE_KEY = "tam_trip_reports_v1";

/**
 * Personal trip journal with add and delete support.
 * @param {object} props - Component props.
 * @returns {JSX.Element} Rendered trip reports page.
 */
export default function TripReportsPage({ substances, combinations }) {
  const [reports, setReports] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(REPORT_STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [view, setView] = useState("grid");
  const [form, setForm] = useState({
    title: "",
    substanceId: "",
    dose: "",
    set: "",
    setting: "",
    report: "",
  });
  const [saved, setSaved] = useState(false);
  const allItems = [...substances, ...combinations];

  /**
   * Saves a newly written report to localStorage.
   */
  const handleSave = () => {
    if (!form.title || !form.report) return;

    const newReport = {
      ...form,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
    };
    const updatedReports = [newReport, ...reports];
    persistReports(updatedReports, setReports);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setView("grid");
      setForm({
        title: "",
        substanceId: "",
        dose: "",
        set: "",
        setting: "",
        report: "",
      });
    }, 1500);
  };

  /**
   * Deletes a saved report from localStorage.
   * @param {number} reportId - Stored report identifier.
   */
  const handleDelete = (reportId) => {
    const shouldDelete = window.confirm(
      "Delete this trip report from your journal?"
    );

    if (!shouldDelete) {
      return;
    }

    persistReports(
      reports.filter((report) => report.id !== reportId),
      setReports
    );
  };

  if (view === "form") {
    return (
      <div style={{ paddingBottom: 40 }}>
        <button
          onClick={() => setView("grid")}
          style={{
            background: "none",
            border: "none",
            color: C.teal,
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "'Merriweather Sans', sans-serif",
            marginBottom: 16,
            padding: 0,
          }}
        >
          ← Back
        </button>
        <div
          style={{
            color: C.white,
            fontSize: 16,
            fontFamily: "'Merriweather', serif",
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          Submit a Trip Report
        </div>
        {[
          { label: "Title", key: "title", placeholder: "Give your experience a title..." },
          { label: "Dose", key: "dose", placeholder: "e.g. 25mg, 3.5g..." },
          {
            label: "Set (mindset going in)",
            key: "set",
            placeholder: "How were you feeling beforehand?",
          },
          {
            label: "Setting (environment)",
            key: "setting",
            placeholder: "Where were you, who were you with?",
          },
        ].map(({ label, key, placeholder }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <div
              style={{
                color: C.greyDim,
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "'Merriweather Sans', sans-serif",
                marginBottom: 6,
              }}
            >
              {label}
            </div>
            <input
              value={form[key]}
              onChange={(event) =>
                setForm((current) => ({ ...current, [key]: event.target.value }))
              }
              placeholder={placeholder}
              style={inputStyle}
            />
          </div>
        ))}
        <div style={{ marginBottom: 14 }}>
          <div style={fieldLabelStyle}>Substance</div>
          <select
            value={form.substanceId}
            onChange={(event) =>
              setForm((current) => ({ ...current, substanceId: event.target.value }))
            }
            style={inputStyle}
          >
            <option value="">Select a substance...</option>
            {allItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={fieldLabelStyle}>Your Report</div>
          <textarea
            value={form.report}
            onChange={(event) =>
              setForm((current) => ({ ...current, report: event.target.value }))
            }
            placeholder="Describe your experience..."
            style={{
              ...inputStyle,
              minHeight: 160,
              resize: "vertical",
            }}
          />
        </div>
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: 14,
            background: saved ? C.tealSoft : C.teal,
            border: "none",
            borderRadius: 12,
            color: C.bg,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Merriweather Sans', sans-serif",
          }}
        >
          {saved ? "Saved!" : "Save Report"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              color: C.white,
              fontSize: 16,
              fontFamily: "'Merriweather', serif",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Trip Reports
          </div>
          <div
            style={{
              color: C.greyDim,
              fontSize: 12,
              fontFamily: "'Merriweather Sans', sans-serif",
            }}
          >
            {reports.length} report{reports.length !== 1 ? "s" : ""} saved
          </div>
        </div>
        <button
          onClick={() => setView("form")}
          style={{
            padding: "10px 16px",
            background: C.teal,
            border: "none",
            borderRadius: 10,
            color: C.bg,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Merriweather Sans', sans-serif",
          }}
        >
          + New Report
        </button>
      </div>

      {reports.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: C.greyDim,
            fontFamily: "'Merriweather Sans', sans-serif",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
          <div style={{ fontSize: 14, marginBottom: 8 }}>No reports yet</div>
          <div style={{ fontSize: 12 }}>
            Submit your first trip report to start building your personal journal.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reports.map((report) => (
            <div
              key={report.id}
              style={{
                background: C.surface,
                borderRadius: 12,
                padding: 16,
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${C.teal}55`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  gap: 12,
                }}
              >
                <span
                  style={{
                    color: C.teal,
                    fontSize: 11,
                    fontFamily: "'Merriweather Sans', sans-serif",
                  }}
                >
                  {allItems.find((item) => item.id === report.substanceId)?.name ||
                    "Unknown"}
                </span>
                <span
                  style={{
                    color: C.greyDim,
                    fontSize: 11,
                    fontFamily: "'Merriweather Sans', sans-serif",
                  }}
                >
                  {report.date}
                </span>
              </div>
              <div
                style={{
                  color: C.white,
                  fontSize: 14,
                  fontFamily: "'Merriweather', serif",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {report.title}
              </div>
              {report.dose && (
                <div
                  style={{
                    color: C.greyDim,
                    fontSize: 12,
                    fontFamily: "'Merriweather Sans', sans-serif",
                    marginBottom: 6,
                  }}
                >
                  Dose: {report.dose}
                </div>
              )}
              <div
                style={{
                  color: C.greyDim,
                  fontSize: 12,
                  fontFamily: "'Merriweather Sans', sans-serif",
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}
              >
                {report.report}
              </div>
              <button
                onClick={() => handleDelete(report.id)}
                style={{
                  padding: "8px 12px",
                  background: "transparent",
                  border: `1px solid ${C.danger}88`,
                  borderRadius: 8,
                  color: "#fca5a5",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Merriweather Sans', sans-serif",
                }}
              >
                Delete Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Persists trip reports in React state and localStorage.
 * @param {Array<object>} nextReports - Reports to store.
 * @param {Function} setReports - State setter from `useState`.
 */
function persistReports(nextReports, setReports) {
  setReports(nextReports);
  try {
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(nextReports));
  } catch {}
}

const fieldLabelStyle = {
  color: C.greyDim,
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontFamily: "'Merriweather Sans', sans-serif",
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  color: C.white,
  fontSize: 13,
  fontFamily: "'Merriweather Sans', sans-serif",
  boxSizing: "border-box",
};
