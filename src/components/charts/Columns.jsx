import { fmt } from '../../utils/format'
import './Columns.css'

// Vertical columns: share label on top, category below.
export default function Columns({ data }) {
  const total = data.reduce((s, [, v]) => s + (v || 0), 0)
  const max = Math.max(0, ...data.map(([, v]) => v || 0))
  if (!max) return <p className="empty">No data for this selection.</p>
  return (
    <div className="columns">
      {data.map(([label, v]) => (
        <div className="col" key={label} title={`${label}: ${fmt(v)}`}>
          <div className="col-plot">
            <span className="col-value">{Math.round(((v || 0) / total) * 100)}%</span>
            <span className="col-bar" style={{ height: `${((v || 0) / max) * 100}%` }} />
          </div>
          <span className="col-label">{label}</span>
        </div>
      ))}
    </div>
  )
}
