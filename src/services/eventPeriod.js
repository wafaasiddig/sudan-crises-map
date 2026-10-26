import { EVENT_LAYERS, VIOLENT_EVENTS_ID } from '../config/webmap'

const DAY = 24 * 60 * 60 * 1000
// Each layer's authored filter, so the date clause can be added and removed again.
const authored = new Map()

/** Date of the most recent violent event (ms), or null if the layer is missing. */
export async function latestEventDate(view) {
  const layer = view.map.findLayerById(VIOLENT_EVENTS_ID)
  if (!layer) return null
  await layer.load()
  const q = layer.createQuery()
  q.outStatistics = [{ statisticType: 'max', onStatisticField: 'event_date', outStatisticFieldName: 'latest' }]
  const { features } = await layer.queryFeatures(q)
  return features[0]?.attributes.latest ?? null
}

/** SQL clause for events within `days` of `latest` (inclusive); null when no date limit applies. */
export function periodWhere(latest, days) {
  if (!latest || !days) return null
  const start = new Date(latest - (days - 1) * DAY).toISOString().slice(0, 10)
  return `event_date >= TIMESTAMP '${start} 00:00:00'`
}

/** Adds `where` to the ACLED layers' own filters; statistics queries pick it up through the layer. */
export function applyEventFilter(map, where) {
  EVENT_LAYERS.forEach((id) => {
    const layer = map.findLayerById(id)
    if (!layer) return
    if (!authored.has(id)) authored.set(id, layer.definitionExpression || null)
    const base = authored.get(id)
    layer.definitionExpression = base && where ? `(${base}) AND (${where})` : base || where
  })
}
