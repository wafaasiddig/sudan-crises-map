import { LineChart } from '@mui/x-charts/LineChart'
import { fmt } from '../../utils/format'
import { formatDay } from '../../utils/timeBuckets'
import './Timeline.css'

// Area line of counts over time; `data` is [[bucketStartMs, value]], `step` is 'day' or 'week'.
export default function Timeline({ data, step }) {
  if (!data.some(([, v]) => v)) return <p className="empty">No data for this selection.</p>

  const dates = data.map(([t]) => new Date(t))
  const peak = data.reduce((best, d) => (d[1] > best[1] ? d : best))

  return (
    <div className="timeline">
      <LineChart
        height={170}
        hideLegend
        margin={{ top: 10, bottom: 0, left: 0, right: 12 }}
        xAxis={[
          {
            data: dates,
            scaleType: 'time',
            tickNumber: 4,
            valueFormatter: (d, ctx) =>
              ctx.location === 'tick' ? formatDay(d, false) : `${step === 'week' ? 'Week of ' : ''}${formatDay(d)}`,
          },
        ]}
        yAxis={[{ width: 32, tickNumber: 3 }]}
        series={[
          {
            data: data.map(([, v]) => v),
            area: true,
            showMark: false,
            color: 'var(--accent)',
            valueFormatter: (v) => `${fmt(v)} events`,
          },
        ]}
        sx={{
          '& .MuiAreaElement-root': { fillOpacity: 0.15 },
          '& .MuiChartsAxis-tickLabel': { fill: 'var(--muted)', fontSize: 11 },
        }}
      />
      <p className="timeline-note">
        Per {step}. Peak: {fmt(peak[1])} events {step === 'week' ? 'in the week of' : 'on'} {formatDay(peak[0])}.
      </p>
    </div>
  )
}
