import { useState } from 'react'
import ChartCard, { ChartSkeleton } from './ChartCard'
import './ChartList.css'

// The column of charts beside the map; two skeleton cards until the first result arrives.
// `metric` is the Events / Fatalities switch, kept here so every chart with `metrics` follows it.
export default function ChartList({ result, loading }) {
  const [metric, setMetric] = useState('events')
  return (
    <div className="chart-col">
      {result
        ? result.charts.map((ch) => (
            <ChartCard key={ch.id || ch.title} chart={ch} loading={loading} metric={metric} onMetric={setMetric} />
          ))
        : [0, 1].map((i) => <ChartSkeleton key={i} />)}
    </div>
  )
}
