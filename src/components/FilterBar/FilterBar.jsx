import { useState } from 'react'
import Icon from '../common/Icon'
import { ICONS } from '../common/icons'
import { COUNTRIES, SCOPES } from '../../config/filters'
import './FilterBar.css'

// Top bar: menu toggle (small screens), country zoom, statistics scope and the Search widget host.
export default function FilterBar({ view, scope, onScopeChange, searchRef, navOpen, onToggleNav }) {
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
    <header className="filters">
      <button className="nav-toggle" onClick={onToggleNav} aria-label="Open themes menu" aria-expanded={navOpen}>
        <Icon d={ICONS.menu} size={22} />
      </button>

      <div className="filter">
        <label className="filter-label" htmlFor="country">Select a Country</label>
        <select id="country" className="select" value={country} onChange={(e) => zoomToCountry(e.target.value)}>
          {COUNTRIES.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="filter">
        <span className="filter-label" id="scope-label">Statistics For</span>
        <div className="segmented" role="radiogroup" aria-labelledby="scope-label">
          {SCOPES.map((s) => (
            <button key={s.id} role="radio" aria-checked={scope === s.id} className={scope === s.id ? 'on' : ''} onClick={() => onScopeChange(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter filter-search">
        <span className="filter-label">Search a Location</span>
        <div ref={searchRef} className="search-host" />
      </div>
    </header>
  )
}
