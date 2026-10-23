import { useState } from 'react'
import { COUNTRIES, SCOPES } from '../../config/filters'
import './FilterBar.css'

// Country zoom and statistics scope, shown at the top of the Insights card.
export default function FilterBar({ view, scope, onScopeChange }) {
  const [country, setCountry] = useState(COUNTRIES[0].name)

  const zoomToCountry = (name) => {
    setCountry(name)
    const c = COUNTRIES.find((x) => x.name === name)
    if (!view) return
    const target = c.center ? { center: c.center, zoom: c.zoom } : view.map.initialViewProperties?.viewpoint
    // goTo rejects when a newer navigation interrupts it; that's expected.
    if (target) view.goTo(target, { duration: 800 }).catch(() => {})
  }

  return (
    <div className="filters">
      <label className="filter">
        <span className="filter-label">Country</span>
        <select className="select" value={country} disabled={!view} onChange={(e) => zoomToCountry(e.target.value)}>
          {COUNTRIES.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
      </label>

      <div className="filter">
        <span className="filter-label" id="scope-label">Statistics for</span>
        <div className="segmented" role="radiogroup" aria-labelledby="scope-label" onKeyDown={(event) => {
          const index = SCOPES.findIndex((item) => item.id === scope)
          const next = ['ArrowRight', 'ArrowDown'].includes(event.key) ? (index + 1) % SCOPES.length
            : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (index - 1 + SCOPES.length) % SCOPES.length
              : event.key === 'Home' ? 0 : event.key === 'End' ? SCOPES.length - 1 : null
          if (next === null) return
          event.preventDefault()
          onScopeChange(SCOPES[next].id)
          event.currentTarget.querySelectorAll('[role="radio"]')[next].focus()
        }}>
          {SCOPES.map((s) => (
            <button key={s.id} role="radio" aria-checked={scope === s.id} tabIndex={scope === s.id ? 0 : -1} className={scope === s.id ? 'on' : ''} onClick={() => onScopeChange(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
