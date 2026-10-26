import { useEffect, useRef, useState } from 'react'
import MapTools from './MapTools'
import { createMapView } from './createMapView'
import { snapshotDefaults, applyView } from './layerVisibility'
import { COUNTRIES } from '../../config/filters'
import { ELECTRIC_GRID_ID } from '../../config/webmap'
import './MapPanel.css'

export default function MapPanel({ activeView, layersRef, padding, onViewReady }) {
  const mapDiv = useRef(null)
  const toolsDiv = useRef(null)
  const panelRefs = { search: useRef(null), legend: useRef(null), basemap: useRef(null) }
  const state = useRef({})
  const activeViewRef = useRef(activeView)
  activeViewRef.current = activeView
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let disposed = false
    const { map, view, destroy } = createMapView({
      container: mapDiv.current,
      tools: toolsDiv.current,
      panels: { layers: layersRef.current, legend: panelRefs.legend.current, basemap: panelRefs.basemap.current },
      search: panelRefs.search.current,
    })

    state.current = { map, view }
    if (import.meta.env.DEV) window.__view = view // handy for debugging in the console
    map
      .load()
      .then(() => {
        if (disposed) return
        // The source grid covers all Africa; restrict it to our target countries.
        const grid = map.findLayerById(ELECTRIC_GRID_ID)
        if (grid) {
          const names = COUNTRIES.map(({ name }) => `'${name.replaceAll("'", "''")}'`).join(', ')
          const regionFilter = `adm0_name IN (${names})`
          grid.definitionExpression = grid.definitionExpression
            ? `(${grid.definitionExpression}) AND (${regionFilter})`
            : regionFilter
        }
        // Apply the tab as soon as the layer tree exists, so the layer list never shows every group.
        state.current.defaults = snapshotDefaults(map.layers)
        applyView(map, activeViewRef.current, state.current.defaults)
      })
      // The view loads visible layers itself. Loading every hidden service here
      // blocks statistics and readiness on unrelated, potentially slow layers.
      .then(() => view.when())
      .then(() => {
        if (disposed) return
        setReady(true)
        onViewReady?.(view)
      })
      .catch((e) => {
        if (!disposed) setError(e.message)
      })

    return () => {
      disposed = true
      destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the map centred in the area the floating cards leave visible.
  useEffect(() => {
    if (state.current.view) state.current.view.padding = padding
  }, [padding])

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
