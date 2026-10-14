import { useEffect, useRef, useState } from 'react'
import esriConfig from '@arcgis/core/config'
import WebMap from '@arcgis/core/WebMap'
import MapView from '@arcgis/core/views/MapView'
import LayerList from '@arcgis/core/widgets/LayerList'
import Legend from '@arcgis/core/widgets/Legend'
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'
import Search from '@arcgis/core/widgets/Search'
import Home from '@arcgis/core/widgets/Home'
import ScaleBar from '@arcgis/core/widgets/ScaleBar'
import Fullscreen from '@arcgis/core/widgets/Fullscreen'
import { PORTAL_URL, WEBMAP_ID, ALWAYS_VISIBLE, NEVER_LISTED } from './config'

esriConfig.portalUrl = PORTAL_URL

// Remember the web map's authored visibility so tabs can fall back to it.
function snapshotDefaults(layers, out = new Map()) {
  layers.forEach((layer) => {
    out.set(layer.id, layer.visible)
    if (layer.layers) snapshotDefaults(layer.layers, out)
  })
  return out
}

function restoreDefaults(layer, defaults) {
  layer.visible = defaults.get(layer.id) ?? layer.visible
  layer.layers?.forEach((child) => restoreDefaults(child, defaults))
}

// Turn on the listed sublayers (and the groups that contain them); everything else off.
function applyOnList(group, on, defaults) {
  let anyOn = false
  group.layers?.forEach((child) => {
    if (on.includes(child.id)) {
      restoreDefaults(child, defaults)
      child.visible = true
      anyOn = true
    } else if (child.layers) {
      const childOn = applyOnList(child, on, defaults)
      child.visible = childOn
      anyOn ||= childOn
    } else {
      child.visible = false
    }
  })
  return anyOn
}

function applyView(map, view, defaults) {
  map.layers.forEach((layer) => {
    const listed = view.groups.includes(layer.id)
    layer.listMode = NEVER_LISTED.includes(layer.id) ? 'hide' : 'show'
    if (ALWAYS_VISIBLE.includes(layer.id)) {
      layer.visible = true
    } else if (listed) {
      layer.visible = true
      if (view.on) applyOnList(layer, view.on, defaults)
      else layer.layers?.forEach((child) => restoreDefaults(child, defaults))
    } else {
      layer.visible = false
      // Keep unrelated groups out of the list, except the reference layers.
      if (!['Admin boundaries', 'Landcover'].includes(layer.title)) layer.listMode = 'hide'
    }
  })
  // Listed groups first, in the order the tab defines.
  view.groups
    .slice()
    .reverse()
    .forEach((id) => {
      const layer = map.findLayerById(id)
      if (layer) map.reorder(layer, map.layers.length - 1)
    })
}

const TOOLS = [
  { id: 'layers', title: 'Layers', icon: 'M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z' },
  { id: 'legend', title: 'Legend', icon: 'M4 5h3v3H4zm5 .5h11v2H9zM4 10.5h3v3H4zm5 .5h11v2H9zM4 16h3v3H4zm5 .5h11v2H9z' },
  { id: 'basemap', title: 'Basemaps', icon: 'M12 2 1.5 7.5 12 13l10.5-5.5zm-8.2 9.4L1.5 12.6 12 18.1l10.5-5.5-2.3-1.2L12 15.7zm0 5L1.5 17.6 12 23.1l10.5-5.5-2.3-1.2L12 20.7z' },
]

export default function MapPanel({ activeView, searchRef, onViewReady }) {
  const mapDiv = useRef(null)
  const toolsDiv = useRef(null)
  const toolDivs = { layers: useRef(null), legend: useRef(null), basemap: useRef(null) }
  const state = useRef({})
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [openTool, setOpenTool] = useState(null)

  useEffect(() => {
    // Widgets remove their container on destroy, so give each one a fresh child node.
    const mount = (ref) => ref.current.appendChild(document.createElement('div'))
    const map = new WebMap({ portalItem: { id: WEBMAP_ID } })
    const view = new MapView({
      container: mapDiv.current,
      map,
      constraints: { snapToZoom: false },
      popup: { dockEnabled: true, dockOptions: { position: 'bottom-right', breakpoint: false } },
    })
    view.ui.remove('attribution')
    view.ui.move('zoom', 'top-left')
    view.ui.add(new Home({ view }), 'top-left')
    view.ui.add(toolsDiv.current, 'top-right')
    view.ui.add(new Fullscreen({ view }), 'bottom-right')
    view.ui.add(new ScaleBar({ view, unit: 'dual' }), 'bottom-right')

    const widgets = [
      new LayerList({
        view,
        container: mount(toolDivs.layers),
        visibilityAppearance: 'checkbox',
        visibleElements: { filter: true, collapseButton: false, heading: false },
        minFilterItems: 1,
        listItemCreatedFunction: ({ item }) => {
          if (item.layer.type !== 'group') item.panel = { content: 'legend', open: false }
          item.actionsSections = [[{ title: 'Zoom to layer', icon: 'zoom-to-object', id: 'zoom' }]]
        },
      }),
      new Legend({ view, container: mount(toolDivs.legend) }),
      new BasemapGallery({ view, container: mount(toolDivs.basemap) }),
      new Search({ view, container: mount(searchRef), popupEnabled: false }),
    ]
    widgets[0].on('trigger-action', ({ action, item }) => {
      if (action.id === 'zoom') item.layer.load().then(() => view.goTo(item.layer.fullExtent))
    })

    state.current = { map, view, widgets }
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

    return () => {
      widgets.forEach((w) => w.destroy())
      view.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const { map, defaults } = state.current
    if (ready && map) applyView(map, activeView, defaults)
  }, [ready, activeView])

  return (
    <div className="map-panel">
      <div ref={mapDiv} className="map-view" />
      <div ref={toolsDiv} className="map-tools">
        <div className="tool-row">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              className={`tool-btn${openTool === t.id ? ' active' : ''}`}
              title={t.title}
              aria-label={t.title}
              aria-pressed={openTool === t.id}
              onClick={() => setOpenTool(openTool === t.id ? null : t.id)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d={t.icon} fill="currentColor" />
              </svg>
            </button>
          ))}
        </div>
        {TOOLS.map((t) => (
          <div key={t.id} className={`tool-popover tool-${t.id}`} hidden={openTool !== t.id}>
            <div className="tool-popover-head">
              <span>{t.title}</span>
              <button onClick={() => setOpenTool(null)} aria-label="Close">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z" fill="currentColor" />
                </svg>
              </button>
            </div>
            <div ref={toolDivs[t.id]} className="tool-popover-body" />
          </div>
        ))}
      </div>
      {!ready && !error && (
        <div className="map-status">
          <span className="dot-pulse" /> Loading map layers…
        </div>
      )}
      {error && <div className="map-status error">Map failed to load: {error}</div>}
    </div>
  )
}
