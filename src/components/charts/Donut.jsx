import { fmt } from '../../utils/format'
import './Donut.css'

// Categorical palette led by the active theme's colour.
const PALETTE = ['var(--accent)', '#94a3b8', '#f59e0b', '#10b981', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#64748b']

// Donut with outside percentage labels and the legend underneath; data rows may carry their own colour.
export default function Donut({ data }) {
  const clean = data.filter(([, v]) => v > 0)
  const total = clean.reduce((s, [, v]) => s + v, 0)
  if (!total) return <p className="empty">No data for this selection.</p>
  const R = 44
  const r = 26
  const pt = (rad, ang) => [80 + rad * Math.cos(ang), 60 + rad * Math.sin(ang)]
  const segs = clean.map(([label, v, color], i) => {
    const preceding = clean.slice(0, i).reduce((sum, [, value]) => sum + value, 0)
    const a0 = -Math.PI / 2 + (preceding / total) * Math.PI * 2
    const share = v / total
    const a1 = a0 + share * Math.PI * 2 - 1e-6
    const large = a1 - a0 > Math.PI ? 1 : 0
    const [x0, y0] = pt(R, a0)
    const [x1, y1] = pt(R, a1)
    const [x2, y2] = pt(r, a1)
    const [x3, y3] = pt(r, a0)
    const mid = (a0 + a1) / 2
    const [lx, ly] = pt(R + 12, mid)
    const seg = {
      label,
      v,
      share,
      color: color ?? PALETTE[i % PALETTE.length],
      d: `M${x0} ${y0}A${R} ${R} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 ${large} 0 ${x3} ${y3}Z`,
      lx,
      ly,
      anchor: Math.abs(Math.cos(mid)) < 0.2 ? 'middle' : Math.cos(mid) > 0 ? 'start' : 'end',
    }
    return seg
  })
  return (
    <div className="donut">
      <svg viewBox="0 0 160 120" className="donut-svg" role="img" aria-label="Donut chart">
        {segs.map((s) => (
          <path key={s.label} d={s.d} fill={s.color} stroke="#fff" strokeWidth="1">
            <title>{`${s.label}: ${fmt(s.v)} (${(s.share * 100).toFixed(1)}%)`}</title>
          </path>
        ))}
        {segs
          .filter((s) => s.share >= 0.04)
          .map((s) => (
            <text key={s.label} x={s.lx} y={s.ly} textAnchor={s.anchor} dominantBaseline="middle" className="donut-label">
              {Math.round(s.share * 100)}%
            </text>
          ))}
        <text x="80" y="57" textAnchor="middle" className="donut-total">
          {fmt(total)}
        </text>
        <text x="80" y="67" textAnchor="middle" className="donut-total-label">
          TOTAL
        </text>
      </svg>
      <ul className="chart-legend">
        {segs.map((s) => (
          <li key={s.label}>
            <span className="swatch" style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
