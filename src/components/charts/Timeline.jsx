import { LineChart } from '@mui/x-charts/LineChart'
import { fmt, fmtShort } from '../../utils/format'
import { formatDay, formatMonth, formatMonthTick, monthTicks } from '../../utils/timeBuckets'
import './Timeline.css'

// Area chart of counts over time (per day or week), styled like ACLED Explorer.
// `data` is [[bucketStartMs, value]], `step` is 'day', 'week' or 'month', `label` names the value (e.g. 'Fatalities').
export default function Timeline({ data, step, label = 'Events' }) {
  if (!data.some(([, v]) => v)) return <p className="empty">No data for this selection.</p>

  const unit = label.toLowerCase()
  const dates = data.map(([t]) => new Date(t))
  const months = monthTicks(data[0][0], data[data.length - 1][0])

  return (
    <div className="timeline">
      <p className="timeline-axis">{label}</p>
      <LineChart
        height={120}
        hideLegend
        grid={{ horizontal: false, vertical: false }}
        margin={{ top: 8, bottom: 0, left: 0, right: 16 }}
        xAxis={[
          {
            data: dates,
            scaleType: 'time',
            height: 32,
            tickSize: 4,
            ...(months ? { tickInterval: months } : { tickNumber: 4 }),
            valueFormatter: (d, ctx) =>
              ctx.location !== 'tick'
                ? step === 'month'
                  ? formatMonth(d)
                  : `${step === 'week' ? 'Week of ' : ''}${formatDay(d)}`
                : months
                  ? formatMonthTick(d)
                  : formatDay(d, false),
          },
        ]}
        yAxis={[{ width: 42, tickNumber: 2, tickSize: 4, disableLine: true, valueFormatter: fmtShort }]}
        series={[
          {
            data: data.map(([, v]) => v),
            area: true,
            showMark: false,
            curve: 'linear',
            color: 'var(--accent)',
            valueFormatter: (v) => `${fmt(v)} ${unit}`,
          },
        ]}
        sx={{
          '& .MuiLineChart-area': { fill: 'var(--timeline-fill)', fillOpacity: 1 },
          '& .MuiLineChart-line': { strokeWidth: 1.5 },
          '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { stroke: '#9aa1a9' },
          '& .MuiChartsAxis-tickLabel': { fill: '#4b5563', fontSize: 11 },
        }}
      />
    </div>
  )
}
