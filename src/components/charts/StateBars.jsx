import { motion, useReducedMotion } from 'framer-motion'
import Panel from '../common/Panel'
import Columns from './Columns'
import Timeline from './Timeline'
import { fmt } from '../../utils/format'
import './StateBars.css'

const METRICS = [
  { id: 'events', label: 'Events', title: 'Events by state' },
  { id: 'fatalities', label: 'Fatalities', title: 'Fatalities by state' },
]

// "Events by state" card, like ACLED Explorer: the Events / Fatalities totals double as the switch.
// `chart.metrics` holds one { data, note, total, timeline } per metric, so switching needs no new query.
// The chosen metric lives in ChartList, so the event-type card below switches with it.
export default function StateBars({ chart, loading, metric, onMetric }) {
  const reduceMotion = useReducedMotion()
  const current = METRICS.find((m) => m.id === metric)
  const { data, note, timeline } = chart.metrics[metric]

  return (
    <Panel title={current.title} className={`chart-card state-bars is-${metric}`} loading={loading}>
      <div className="state-switch" role="radiogroup" aria-label="Show events or fatalities">
        {METRICS.map((m) => {
          const on = m.id === metric
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              className={`state-switch-${m.id}${on ? ' on' : ''}`}
              onClick={() => onMetric(m.id)}
            >
              <span className="state-switch-value">{fmt(chart.metrics[m.id].total)}</span>
              <span className="state-switch-label">{m.label}</span>
              {on && (
                <motion.span
                  layoutId="state-switch-line"
                  className="state-switch-line"
                  transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
                />
              )}
            </button>
          )
        })}
      </div>
      <Timeline data={timeline.data} step={timeline.step} label={current.label} />
      <Columns data={data} note={note} showShare={false} />
    </Panel>
  )
}
