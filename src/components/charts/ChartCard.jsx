import Panel from '../common/Panel'
import Donut from './Donut'
import Columns from './Columns'
import StackedBars from './StackedBars'
import '../common/Skeleton.css'
import './ChartCard.css'

export default function ChartCard({ chart, loading }) {
  return (
    <Panel title={chart.title} className="chart-card" loading={loading}>
      {chart.type === 'donut' ? (
        <Donut data={chart.data} />
      ) : chart.type === 'stackedBars' ? (
        <StackedBars series={chart.series} data={chart.data} />
      ) : (
        <Columns data={chart.data} />
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
