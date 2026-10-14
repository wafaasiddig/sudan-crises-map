import { useRef, useState } from 'react'
import MapPanel from './MapPanel'
import { useStats, KpiRow, ChartCard } from './stats'
import { VIEWS, DISCLAIMER } from './config'
import './App.css'

// Approximate centre / zoom per country for the "Select a country" filter.
const COUNTRIES = [
  { name: 'All countries', center: null },
  { name: 'Sudan', center: [30.2, 15.6], zoom: 5 },
  { name: 'Chad', center: [18.7, 15.4], zoom: 5 },
  { name: 'South Sudan', center: [30.3, 7.6], zoom: 6 },
  { name: 'Central African Republic', center: [20.9, 6.6], zoom: 6 },
  { name: 'Ethiopia', center: [39.6, 9.1], zoom: 5 },
  { name: 'Egypt', center: [30.8, 26.8], zoom: 5 },
  { name: 'Libya', center: [17.2, 26.3], zoom: 5 },
  { name: 'Uganda', center: [32.3, 1.4], zoom: 6 },
]

const SCOPES = [
  { id: 'extent', label: 'Map view' },
  { id: 'region', label: 'Whole region' },
]

function Icon({ d, size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={d} fill="currentColor" />
    </svg>
  )
}

export default function App() {
  const [activeView, setActiveView] = useState(VIEWS[0])
  const [view, setView] = useState(null)
  const [scope, setScope] = useState('extent')
  const [country, setCountry] = useState(COUNTRIES[0].name)
  const [navOpen, setNavOpen] = useState(false)
  const searchRef = useRef(null)
  const { result, loading, error } = useStats(view, activeView, scope)

  const zoomToCountry = (name) => {
    setCountry(name)
    const c = COUNTRIES.find((x) => x.name === name)
    if (!view) return
    const target = c.center ? { center: c.center, zoom: c.zoom } : view.map.initialViewProperties?.viewpoint
    // goTo rejects when a newer navigation interrupts it; that's expected.
    if (target) view.goTo(target, { duration: 800 }).catch(() => {})
  }

  return (
    <div className={`app${navOpen ? ' nav-open' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <path d="M3 16h26M16 3c3.6 3.6 5.4 8 5.4 13S19.6 25.4 16 29M16 3c-3.6 3.6-5.4 8-5.4 13s1.8 9.4 5.4 13" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <div>
            <div className="brand-name">Sudan Crisis</div>
            <div className="brand-sub">Regional Map</div>
          </div>
        </div>

        <nav className="nav" aria-label="Themes">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              className={`nav-item${v.id === activeView.id ? ' active' : ''}`}
              aria-current={v.id === activeView.id ? 'page' : undefined}
              onClick={() => {
                setActiveView(v)
                setNavOpen(false)
              }}
            >
              <Icon d={v.icon} size={20} />
              <span>{v.label}</span>
            </button>
          ))}
        </nav>

        <p className="sidebar-foot">Data: UNHCR, ACLED, OCHA, Global Energy Monitor, healthsites.io</p>
      </aside>

      <div className="main">
        <header className="filters">
          <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Open themes menu" aria-expanded={navOpen}>
            <Icon d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" size={22} />
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
                <button key={s.id} role="radio" aria-checked={scope === s.id} className={scope === s.id ? 'on' : ''} onClick={() => setScope(s.id)}>
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

        <div className="content">
          <h1 className="page-title">{activeView.label}</h1>

          <KpiRow result={result} loading={loading} />
          {error && <p className="error-msg">Could not load statistics: {error}</p>}

          <div className="grid">
            <section className="panel map-card">
              <h3 className="panel-title">{activeView.label} map</h3>
              <div className="map-frame">
                <MapPanel activeView={activeView} searchRef={searchRef} onViewReady={setView} />
              </div>
            </section>

            <div className="chart-col">
              {(result?.charts ?? [{ title: 'Loading…', type: 'donut', data: [] }, { title: 'Loading…', type: 'columns', data: [] }]).map((ch, i) =>
                result ? (
                  <ChartCard key={ch.title} chart={ch} loading={loading} />
                ) : (
                  <section className="panel chart-card" key={i}>
                    <div className="sk sk-title" />
                    <div className="sk sk-chart" />
                  </section>
                ),
              )}
            </div>
          </div>

          <p className="footnote">
            {scope === 'extent' ? 'Figures update for the area shown on the map. ' : 'Figures cover the whole region. '}
            {result?.source && `Source: ${result.source}. `}
            {DISCLAIMER}
          </p>
        </div>
      </div>
      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} />}
    </div>
  )
}
