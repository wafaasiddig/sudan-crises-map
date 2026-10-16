import { useEffect, useRef, useState } from 'react'
import MapTools from './MapTools'
import { createMapView } from './createMapView'
import { snapshotDefaults, applyView } from './layerVisibility'
import './MapPanel.css'

export default function MapPanel({ activeView, searchRef, onViewReady }) {
  const mapDiv = useRef(null)
  const toolsDiv = useRef(null)
  const panelRefs = { layers: useRef(null), legend: useRef(null), basemap: useRef(null) }
  const state = useRef({})
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const { map, view, destroy } = createMapView({
      container: mapDiv.current,
      tools: toolsDiv.current,
      panels: { layers: panelRefs.layers.current, legend: panelRefs.legend.current, basemap: panelRefs.basemap.current },
      search: searchRef.current,
    })

    state.current = { map, view }
    if (import.meta.env.DEV) window.__view = view // handy for debugging in the console
    map
      .loadAll()
      .catch(() => {}) // a single failing service should not block the rest
      .then(() => view.when())
      .then(() => {
        state.current.defaults = snapshotDefaults(map.layers)
        setReady(true)
        onViewReady?.(view)
      })
      .catch((e) => setError(e.message))

    return destroy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const { map, defaults } = state.current
    if (ready && map) applyView(map, activeView, defaults)
  }, [ready, activeView])

  return (
    <div className="map-panel">
      <div ref={mapDiv} className="map-view" />
      <MapTools ref={toolsDiv} panelRefs={panelRefs} />
      {!ready && !error && (
        <div className="map-status">
          <span className="dot-pulse" /> Loading map layers…
        </div>
      )}
      {error && <div className="map-status error">Map failed to load: {error}</div>}
    </div>
  )
}
