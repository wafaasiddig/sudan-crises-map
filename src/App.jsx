import { useRef, useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import FilterBar from './components/FilterBar/FilterBar'
import KpiRow from './components/KpiRow/KpiRow'
import ChartList from './components/charts/ChartList'
import MapPanel from './components/map/MapPanel'
import Panel from './components/common/Panel'
import { useStats } from './hooks/useStats'
import { VIEWS, DISCLAIMER } from './config/views'
import './App.css'

export default function App() {
  const [activeView, setActiveView] = useState(VIEWS[0])
  const [view, setView] = useState(null)
  const [scope, setScope] = useState('extent')
  const [navOpen, setNavOpen] = useState(false)
  const searchRef = useRef(null)
  const { result, loading, error } = useStats(view, activeView, scope)

  const selectView = (v) => {
    setActiveView(v)
    setNavOpen(false)
  }

  return (
    <div className={`app${navOpen ? ' nav-open' : ''}`}>
      <Sidebar activeView={activeView} onSelect={selectView} />

      <div className="main">
        <FilterBar view={view} scope={scope} onScopeChange={setScope} searchRef={searchRef} navOpen={navOpen} onToggleNav={() => setNavOpen(!navOpen)} />

        <div className="content">
          <h1 className="page-title">{activeView.label}</h1>

          <KpiRow result={result} loading={loading} />
          {error && <p className="error-msg">Could not load statistics: {error}</p>}

          <div className="grid">
            <Panel title={`${activeView.label} map`} className="map-card">
              <div className="map-frame">
                <MapPanel activeView={activeView} searchRef={searchRef} onViewReady={setView} />
              </div>
            </Panel>

            <ChartList result={result} loading={loading} />
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
