import { useEffect, useState } from 'react'
import AggregateField from '@arcgis/core/layers/support/AggregateField'
import { VIOLENT_EVENTS_ID } from '../config/webmap'

const FIELDS = ['location', 'admin1', 'fatalities']

// Clusters only carry a count by default; also total the fatalities and keep the most frequent place.
function prepareLayer(layer) {
  layer.outFields = [...new Set([...(layer.outFields ?? []), ...FIELDS])]
  const reduction = layer.featureReduction
  if (reduction?.type !== 'cluster' || reduction.fields.some((f) => f.name === 'hover_fatalities')) return
  const clone = reduction.clone()
  clone.fields = [
    ...clone.fields,
    new AggregateField({ name: 'hover_fatalities', onStatisticField: 'fatalities', statisticType: 'sum' }),
    new AggregateField({ name: 'hover_location', onStatisticField: 'location', statisticType: 'mode' }),
  ]
  layer.featureReduction = clone
}

function toInfo(graphic, x, y) {
  const a = graphic.attributes ?? {}
  if (graphic.isAggregate) {
    return { x, y, name: a.hover_location, fatalities: a.hover_fatalities, events: a.cluster_count }
  }
  return { x, y, name: a.location || a.admin1, fatalities: a.fatalities, events: 1 }
}

/** While enabled, returns { x, y, name, fatalities, events } for the violent-event bubble under the mouse, or null. */
export function useHoverInfo(view, enabled) {
  const [info, setInfo] = useState(null)

  useEffect(() => {
    if (!view || !enabled) return
    const layer = view.map.findLayerById(VIOLENT_EVENTS_ID)
    if (!layer) return
    layer.when(() => prepareLayer(layer)).catch(() => {})

    let busy = false
    let queued = null
    const container = view.container

    // One hitTest at a time; while one runs, only the newest pointer position is kept.
    const test = async (e) => {
      busy = true
      try {
        const { results } = await view.hitTest(e, { include: [layer] })
        const graphic = results.find((r) => r.type === 'graphic')?.graphic
        setInfo(graphic ? toInfo(graphic, e.x, e.y) : null)
        container.style.cursor = graphic ? 'pointer' : ''
      } catch {
        setInfo(null)
      }
      busy = false
      if (queued) {
        const next = queued
        queued = null
        test(next)
      }
    }

    const handles = [
      view.on('pointer-move', (e) => {
        if (e.pointerType !== 'mouse') return
        if (busy) queued = e
        else test(e)
      }),
      view.on('pointer-leave', () => {
        queued = null
        setInfo(null)
      }),
      view.on('drag', () => setInfo(null)),
    ]

    return () => {
      handles.forEach((h) => h.remove())
      container.style.cursor = ''
      setInfo(null)
    }
  }, [view, enabled])

  return info
}
