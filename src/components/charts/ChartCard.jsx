import Panel from '../common/Panel'
import Donut from './Donut'
import Columns from './Columns'
import StackedBars from './StackedBars'
import Timeline from './Timeline'
import StateBars from './StateBars'
import '../common/Skeleton.css'
import './ChartCard.css'
export default function ChartCard({ chart, loading, metric, onMetric }) {
  // Has its own switch and title, so it draws its own card.
  if (chart.type === 'stateBars') return <StateBars chart={chart} loading={loading} metric={metric} onMetric={onMetric} />
  // Charts with `metrics` hold one { title, data } per metric; show the one the switch points at.
  const { title, data, note } = chart.metrics ? chart.metrics[metric] : chart
  return (
    <Panel title={title} className="chart-card" loading={loading}>
      {chart.type === 'donut' ? (
        <Donut data={chart.data} />
      ) : chart.type === 'timeline' ? (
        <Timeline data={chart.data} step={chart.step} />
      ) : chart.type === 'stackedBars' ? (
        <StackedBars series={chart.series} data={chart.data} />
      ) : (
        <Columns data={data} note={note} />
      )}
    </Panel>
  )
}

export function ChartSkeleton() {
  return (
    <Panel className="chart-card">
      <div className="sk sk-title" />
      <div className="sk sk-chart" />
    </Panel>
  )
}
