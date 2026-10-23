import { fmt } from '../../utils/format'
import './StackedBars.css'

// Horizontal bars split into coloured segments, largest bar first; legend underneath.
//  series – [[key, label, colour]] in stacking order
//  data   – [[category, { [key]: value }]]
export default function StackedBars({ series, data }) {
  const rows = data
    .map(([label, values]) => [label, values, series.reduce((s, [key]) => s + (values[key] || 0), 0)])
    .filter(([, , total]) => total > 0)
    .sort((a, b) => b[2] - a[2])
  const max = rows[0]?.[2]
  if (!max) return <p className="empty">No data for this selection.</p>
  return (
    <div className="stacked">
      <div className="stacked-rows">
        {rows.map(([label, values, total]) => (
          <div className="stacked-row" key={label} title={`${label}: ${fmt(total)}`}>
            <span className="stacked-label">{label}</span>
            <div className="stacked-track">
              {series.map(([key, name, color]) =>
                values[key] ? (
                  <span key={key} className="stacked-seg" style={{ width: `${(values[key] / max) * 100}%`, background: color }} title={`${label} – ${name}: ${fmt(values[key])}`}>
                    {values[key] / max >= 0.15 && fmt(values[key])}
                  </span>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>
      <ul className="chart-legend">
        {series.map(([key, name, color]) => (
          <li key={key}>
            <span className="swatch" style={{ background: color }} />
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}
