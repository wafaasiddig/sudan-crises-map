import { queryStats as stats } from '../statsQuery'
import { fmt, sum } from '../../utils/format'
import { formatDay, toTimeSeries } from '../../utils/timeBuckets'
import { EVENT_TYPE_COLORS } from '../../config/eventColors'

const TOP_STATES = 10

// Top-10 state (admin 1) lists by events and by fatalities, like ACLED Explorer's "Highest frequency" panel.
// The country is added to each name only when the selection spans several countries.
// Each metric also carries its own timeline (per day/week), drawn above the bars.
function topStates(rows, days) {
  const multi = new Set(rows.map((r) => r.country)).size > 1
  const name = (r) => (multi ? `${r.admin1 || 'Unknown'} (${r.country})` : r.admin1 || 'Unknown')
  const note = rows.length > TOP_STATES ? `Top ${TOP_STATES} of ${rows.length} states.` : null
  const top = (field) => ({
    data: [...rows].sort((a, b) => (b[field] || 0) - (a[field] || 0)).slice(0, TOP_STATES).map((r) => [name(r), r[field] || 0]),
    note,
    total: rows.reduce((t, r) => t + (r[field] || 0), 0), // all states, shown on the switch
    timeline: toTimeSeries(days, 'event_date', field),
  })
  return { type: 'stateBars', title: 'Events by state', metrics: { events: top('events'), fatalities: top('fatalities') } }
}

export default async function security(view, g) {
  const [rows, days, states] = await Promise.all([
    stats(view, 'Violent events', [['count', 'OBJECTID', 'events'], ['sum', 'fatalities', 'fatalities']], 'event_type', g),
    stats(view, 'Violent events', [['count', 'OBJECTID', 'events'], ['sum', 'fatalities', 'fatalities']], 'event_date', g),
    stats(view, 'Violent events', [['count', 'OBJECTID', 'events'], ['sum', 'fatalities', 'fatalities']], ['admin1', 'country'], g),
  ])
  const events = sum(rows, 'events')
  const timeline = toTimeSeries(days, 'event_date', 'events')
  const span = timeline.data.length
    ? ` between ${formatDay(timeline.data[0][0])} and ${formatDay(Math.max(...days.map((d) => d.event_date)))}`
    : ''
  return {
    summary: `${fmt(events)} events${span}, of type ${rows.map((r) => r.event_type).join(', ') || '–'}.`,
    charts: [
      topStates(states, days),
      {
        type: 'columns',
        title: 'Fatalities by event type',
        data: rows
          .map((r) => [r.event_type, r.fatalities, EVENT_TYPE_COLORS[r.event_type]])
          .sort((a, b) => b[1] - a[1]),
      },
      { type: 'donut', title: '% of events by type', data: rows.map((r) => [r.event_type, r.events]) },
    ],
    source: 'ACLED, filtered to the selected period',
  }
}
