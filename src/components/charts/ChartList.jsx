import ChartCard, { ChartSkeleton } from './ChartCard'
import './ChartList.css'

// The column of charts beside the map; two skeleton cards until the first result arrives.
export default function ChartList({ result, loading }) {
  return (
    <div className="chart-col">
      {result ? result.charts.map((ch) => <ChartCard key={ch.title} chart={ch} loading={loading} />) : [0, 1].map((i) => <ChartSkeleton key={i} />)}
    </div>
  )
}
