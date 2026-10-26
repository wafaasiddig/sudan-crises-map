import { useCallback, useEffect, useRef, useState } from 'react'
import Graphic from '@arcgis/core/Graphic'
import { ADMIN_AREAS } from '../config/webmap'

const OUTLINE = {
  type: 'simple-fill',
  color: [15, 108, 189, 0.12],
  outline: { color: [15, 108, 189, 1], width: 2.5 },
}

// The admin area under a map point: districts when they are drawn at this scale, otherwise states.
async function findArea(view, point) {
  const layers = ADMIN_AREAS.map((id) => view.map.findLayerById(id)).filter(Boolean)
  const layer = layers.find((l) => !l.minScale || view.scale <= l.minScale) ?? layers[layers.length - 1]
  if (!layer) return null
  await layer.load()
  const q = layer.createQuery()
  q.geometry = point
  q.returnGeometry = true
  q.outFields = ['gis_name']
  q.outSpatialReference = view.spatialReference
  q.maxAllowableOffset = 100 // ~100 m generalisation keeps the statistics queries small
  const { features } = await layer.queryFeatures(q)
  const f = features[0]
  return f && { name: f.attributes.gis_name, geometry: f.geometry }
}

/** While enabled, a map click selects the admin area under it and outlines it on the map. */
export function useSelectedArea(view, enabled) {
  const [area, setArea] = useState(null)
  const latest = useRef(0)
  const clearSelection = useCallback(() => {
    latest.current += 1
    setArea(null)
  }, [])

  useEffect(() => {
    if (!view || !enabled) return
    const handle = view.on('click', async (e) => {
      const id = ++latest.current
      try {
        const found = await findArea(view, e.mapPoint)
        // Ignore clicks outside the covered countries and answers to an older click.
        if (found && id === latest.current) setArea(found)
      } catch {
        // A failing boundary service leaves the previous selection in place.
      }
    })
    return () => {
      latest.current += 1
      handle.remove()
    }
  }, [view, enabled])

  useEffect(() => {
    if (!view || !enabled || !area) return
    const graphic = new Graphic({ geometry: area.geometry, symbol: OUTLINE })
    view.graphics.add(graphic)
    return () => view.graphics.remove(graphic)
  }, [view, enabled, area])

  return { area, clearSelection }
}
