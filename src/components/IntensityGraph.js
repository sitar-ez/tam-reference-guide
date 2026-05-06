import { C } from "../data/referenceData";
import { generateCurve } from "../utils/referenceUtils";

/**
 * SVG line chart showing estimated intensity over time.
 * @param {object} props - Component props.
 * @param {object} props.src - Active source data with onset, peak, duration, and doses.
 * @param {number} props.dose - Current primary dose value.
 * @param {object} props.booster - Booster state for the visualization.
 * @returns {JSX.Element} Rendered intensity graph.
 */
export default function IntensityGraph({ src, dose, booster }) {
  const width = 600;
  const height = 200;
  const paddingLeft = 38;
  const paddingRight = 16;
  const paddingTop = 14;
  const paddingBottom = 32;
  const doseRatio = Math.max(0.05, dose / src.doses.heavy);
  const maxIntensity = Math.min(10, doseRatio * 8 + 1);
  const boosterData = booster?.enabled
    ? {
        time: booster.time,
        intensity: Math.min(6, (booster.dose / src.doses.moderate) * 4),
        peak: src.peak,
        duration: src.duration,
      }
    : null;
  const points = generateCurve(
    src.onset,
    src.peak,
    src.duration,
    maxIntensity,
    boosterData
  );
  const maxTime = points[points.length - 1].t;
  const scaleX = (time) => paddingLeft + (time / maxTime) * (width - paddingLeft - paddingRight);
  const scaleY = (value) =>
    paddingTop + (1 - value / 10) * (height - paddingTop - paddingBottom);
  const pathData = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${scaleX(point.t).toFixed(1)} ${scaleY(point.v).toFixed(1)}`
    )
    .join(" ");
  const areaData =
    pathData +
    ` L ${scaleX(maxTime).toFixed(1)} ${scaleY(0).toFixed(1)} L ${scaleX(0).toFixed(1)} ${scaleY(
      0
    ).toFixed(1)} Z`;
  const hourTicks = [];

  for (let hour = 0; hour * 60 <= maxTime; hour += 1) {
    hourTicks.push(hour);
  }

  return (
    <div
      style={{
        background: C.bg,
        borderRadius: 12,
        padding: "14px 16px 10px",
        marginTop: 14,
        border: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          color: C.greyDim,
          fontSize: 10,
          marginBottom: 8,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "'Merriweather Sans', sans-serif",
        }}
      >
        Intensity Over Time
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.teal} stopOpacity="0.4" />
            <stop offset="100%" stopColor={C.teal} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 2, 4, 6, 8, 10].map((value) => (
          <line
            key={value}
            x1={paddingLeft}
            y1={scaleY(value)}
            x2={width - paddingRight}
            y2={scaleY(value)}
            stroke={C.border}
            strokeWidth="1"
          />
        ))}
        <path d={areaData} fill="url(#tg)" />
        <path
          d={pathData}
          fill="none"
          stroke={C.teal}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {boosterData && (
          <>
            <line
              x1={scaleX(boosterData.time)}
              y1={paddingTop}
              x2={scaleX(boosterData.time)}
              y2={height - paddingBottom}
              stroke={C.tealSat}
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text
              x={scaleX(boosterData.time) + 4}
              y={paddingTop + 11}
              fill={C.tealSat}
              fontSize="9"
              fontFamily="'Merriweather Sans', sans-serif"
            >
              booster
            </text>
          </>
        )}
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={height - paddingBottom}
          stroke={C.border}
          strokeWidth="1"
        />
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke={C.border}
          strokeWidth="1"
        />
        {[0, 2, 4, 6, 8, 10].map((value) => (
          <text
            key={value}
            x={paddingLeft - 5}
            y={scaleY(value) + 3}
            textAnchor="end"
            fill={C.greyDim}
            fontSize="9"
            fontFamily="'Merriweather Sans', sans-serif"
          >
            {value}
          </text>
        ))}
        {hourTicks.map((hour) => (
          <text
            key={hour}
            x={scaleX(hour * 60)}
            y={height - paddingBottom + 13}
            textAnchor="middle"
            fill={C.greyDim}
            fontSize="9"
            fontFamily="'Merriweather Sans', sans-serif"
          >
            {hour}h
          </text>
        ))}
        <text
          x={paddingLeft - 26}
          y={paddingTop + (height - paddingTop - paddingBottom) / 2}
          textAnchor="middle"
          fill={C.greyDim}
          fontSize="9"
          fontFamily="'Merriweather Sans', sans-serif"
          transform={`rotate(-90,${paddingLeft - 26},${
            paddingTop + (height - paddingTop - paddingBottom) / 2
          })`}
        >
          Intensity
        </text>
      </svg>
    </div>
  );
}
