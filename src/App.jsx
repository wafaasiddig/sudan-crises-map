import { useEffect, useRef, useState } from 'react'
import TopBar from './components/TopBar/TopBar'
import CountryBar from './components/CountryBar/CountryBar'
import KpiRow from './components/KpiRow/KpiRow'
import ChartList from './components/charts/ChartList'
import MapPanel from './components/map/MapPanel'
import Icon from './components/common/Icon'
import { ICONS } from './components/common/icons'
import { useStats } from './hooks/useStats'
import { useSelectedArea } from './hooks/useSelectedArea'
import { VIEWS, DISCLAIMER } from './config/views'
import './App.css'

const DESKTOP = '(min-width: 961px)'
const NO_PADDING = { left: 0, right: 0, top: 0, bottom: 0 }

function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export default function App() {
  const [activeView, setActiveView] = useState(VIEWS[0])
  const [view, setView] = useState(null)
  const [layersOpen, setLayersOpen] = useState(false)
  const [insightsOpen, setInsightsOpen] = useState(true)
  const isDesktop = useMedia(DESKTOP)
  const layersRef = useRef(null)
  const { area, clearSelection } = useSelectedArea(view, true)
  const scope = area ? 'selection' : 'extent'
  const { result, loading, error } = useStats(view, activeView, scope, area)

  // Space taken by the floating cards, so the map centres in what's left visible.
  const padding = isDesktop ? { left: layersOpen ? 312 : 76, right: insightsOpen ? 404 : 76, top: 0, bottom: 0 } : NO_PADDING

  const scopeNote =
    area
      ? `Figures cover ${area.name}; click another admin on the map to change it. `
      : 'Figures update for the area shown on the map. Click an admin to see its figures. '

  const status = loading
    ? 'Updating…'
    : scope === 'extent'
      ? 'Live for the current map extent'
      : 'Statistics for the selected admin'

  return (
    <div className="app" style={{ '--accent': activeView.accent }}>
      <TopBar activeView={activeView} onSelect={setActiveView} />

      <main className="stage" id="map-workspace" aria-label={`${activeView.label} map workspace`}>
        <MapPanel activeView={activeView} layersRef={layersRef} padding={padding} onViewReady={setView} />
        <CountryBar view={view} inset={padding} />

        <section className={`card layers-card${layersOpen ? '' : ' collapsed'}`} aria-label="Layers">
          <div className="card-head">
            <button
              className="icon-btn"
              onClick={() => setLayersOpen(!layersOpen)}
              aria-expanded={layersOpen}
              aria-controls="map-layers"
              aria-label={layersOpen ? 'Collapse layers' : 'Expand layers'}
              title={layersOpen ? 'Collapse layers' : 'Expand layers'}
            >
              <Icon d={ICONS.layers} size={18} />
            </button>
            <div className="card-title">
              <h2>Layers</h2>
              <p>{activeView.label} view</p>
            </div>
            <button className="icon-btn ghost chevron" onClick={() => setLayersOpen(false)} aria-label="Collapse layers">
              <Icon d={ICONS.chevronLeft} size={18} />
            </button>
          </div>
          <div ref={layersRef} id="map-layers" className="layer-list" />
        </section>

        <aside className={`card stats-card${insightsOpen ? '' : ' collapsed'}`} aria-label="Map insights" aria-busy={loading}>
          <div className="card-head">
            <button
              className="icon-btn insights-toggle"
              onClick={() => setInsightsOpen(!insightsOpen)}
              aria-expanded={insightsOpen}
              aria-controls="insights-content"
              aria-label={insightsOpen ? 'Collapse insights' : 'Expand insights'}
              title={insightsOpen ? 'Collapse insights' : 'Expand insights'}
            >
              <Icon d={ICONS.gauge} size={18} />
            </button>
            <div className="card-title">
              <h1>{activeView.label} insights</h1>
              <p>
                <span className={`live-dot${loading ? ' busy' : ''}`} aria-hidden="true" />
                {status}
              </p>
            </div>
          </div>

          <div className="insights-content" id="insights-content" hidden={!insightsOpen}>
            <div className="stats-body">
              {error && <p className="error-msg" role="alert">Could not load statistics: {error}</p>}
              {(!error || result) && <KpiRow result={result} loading={loading} />}
              <div className="stats-scope">
                <span aria-live="polite">For: {area ? area.name : 'Map view'}</span>
                {area && <button type="button" className="reset-scope" onClick={clearSelection}>Back to map view</button>}
              </div>
              {(!error || result) && <ChartList result={result} loading={loading} />}

              <div className="note">
                <Icon d={ICONS.info} size={14} />
                <p>
                  {scopeNote}
                  {result?.source && <span className="source">Source: {result.source}. </span>}
                  {DISCLAIMER}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
