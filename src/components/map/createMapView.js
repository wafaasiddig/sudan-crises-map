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
import { PORTAL_URL, WEBMAP_ID } from '../../config/webmap'

esriConfig.portalUrl = PORTAL_URL

// Widgets remove their container on destroy, so give each one a fresh child node.
const mount = (node) => node.appendChild(document.createElement('div'))

/**
 * Builds the web map, the view and its widgets.
 *  container – element the MapView renders into
 *  tools     – element placed in the view's top-right corner (the tool buttons)
 *  panels    – { layers, legend, basemap } elements that host those widgets
 *  search    – element that hosts the Search widget
 */
export function createMapView({ container, tools, panels, search }) {
  const map = new WebMap({ portalItem: { id: WEBMAP_ID } })
  const view = new MapView({
    container,
    map,
    constraints: { snapToZoom: false },
    popup: { dockEnabled: true, dockOptions: { position: 'bottom-right', breakpoint: false } },
  })
  view.ui.remove('attribution')
  view.ui.move('zoom', 'top-left')
  view.ui.add(new Home({ view }), 'top-left')
  view.ui.add(tools, 'top-right')
  view.ui.add(new Fullscreen({ view }), 'bottom-right')
  view.ui.add(new ScaleBar({ view, unit: 'dual' }), 'bottom-right')

  const layerList = new LayerList({
    view,
    container: mount(panels.layers),
    visibilityAppearance: 'checkbox',
    visibleElements: { filter: true, collapseButton: false, heading: false },
    minFilterItems: 1,
    listItemCreatedFunction: ({ item }) => {
      if (item.layer.type !== 'group') item.panel = { content: 'legend', open: false }
      item.actionsSections = [[{ title: 'Zoom to layer', icon: 'zoom-to-object', id: 'zoom' }]]
    },
  })
  layerList.on('trigger-action', ({ action, item }) => {
    if (action.id === 'zoom') item.layer.load().then(() => view.goTo(item.layer.fullExtent))
  })

  const widgets = [
    layerList,
    new Legend({ view, container: mount(panels.legend) }),
    new BasemapGallery({ view, container: mount(panels.basemap) }),
    new Search({ view, container: mount(search), popupEnabled: false }),
  ]

  return {
    map,
    view,
    destroy() {
      widgets.forEach((w) => w.destroy())
      view.destroy()
    },
  }
}
