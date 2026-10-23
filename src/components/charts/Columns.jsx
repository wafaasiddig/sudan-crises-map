import { fmt } from '../../utils/format'
import './Columns.css'

// Thin horizontal bars: category and value on top, share of the total beside the value.
export default function Columns({ data }) {
  const total = data.reduce((s, [, v]) => s + (v || 0), 0)
  const max = Math.max(0, ...data.map(([, v]) => v || 0))
  if (!max) return <p className="empty">No data for this selection.</p>
  return (
    <ul className="bars">
      {data.map(([label, v]) => (
        <li key={label} title={`${label}: ${fmt(v)}`}>
          <div className="bar-meta">
            <span className="bar-label">{label}</span>
            <span className="bar-value">
              {fmt(v)} <span className="bar-share">{Math.round(((v || 0) / total) * 100)}%</span>
            </span>
          </div>
          <span className="bar-track">
            <span className="bar-fill" style={{ width: `${((v || 0) / max) * 100}%` }} />
          </span>
        </li>
      ))}
    </ul>
  )
}
