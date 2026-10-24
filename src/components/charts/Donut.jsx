import { PieChart } from "@mui/x-charts/PieChart";
import { fmt } from "../../utils/format";
import "./Donut.css";

const PALETTE = [
  "var(--accent)",
  "#94a3b8",
  "#f59e0b",
  "#10b981",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#64748b",
];

export default function Donut({ data }) {
  const clean = data.filter(([, value]) => value > 0);
  const total = clean.reduce((sum, [, value]) => sum + value, 0);
  if (!total) return <p className="empty">No data for this selection.</p>;

  const slices = clean.map(([label, value, color], index) => ({
    id: index,
    label,
    value,
    color: color ?? PALETTE[index % PALETTE.length],
  }));

  return (
    <div className="donut">
      <div className="donut-chart">
        <PieChart
          height={170}
          hideLegend
          margin={{ top: 20, bottom: 20, left: 30, right: 30 }}
          series={[
            {
              data: slices,
              innerRadius: "72%",
              outerRadius: "95%",
              valueFormatter: (item) =>
                `${fmt(item.value)} (${((item.value / total) * 100).toFixed(1)}%)`,
            },
          ]}
          sx={{
            "& .MuiPieArcLabel-root": { fill: "var(--ink-2)", fontSize: 11 },
            "& .MuiPieArc-root": { stroke: "#fff", strokeWidth: 1 },
          }}
        />
        <div className="donut-center">
          <span className="donut-total">{fmt(total)}</span>
          <span className="donut-total-label">TOTAL</span>
        </div>
      </div>
      <ul className="chart-legend">
        {slices.map((slice) => (
          <li key={slice.id}>
            <span className="swatch" style={{ background: slice.color }} />
            <span>{slice.label}</span>
            <span className="donut-share">
              {Math.round((slice.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
