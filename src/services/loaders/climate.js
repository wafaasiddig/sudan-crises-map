import { queryStats as stats } from '../statsQuery'
import { fmt, pct, sum } from '../../utils/format'

const level = (r) => ['', 'Low', 'Medium', 'High', 'Severe'][r.Flood_risk] || String(r.Flood_risk)

export default async function climate(view, g) {
  const rows = await stats(
    view,
    'Displaced & returnee locations in flood zones',
    [['count', 'OBJECTID', 'n'], ['sum', 'total', 'pop']],
    'Flood_risk',
    g,
  )
  rows.sort((a, b) => a.Flood_risk - b.Flood_risk)
  const n = sum(rows, 'n')
  return {
    kpis: [
      { icon: 'people', value: fmt(sum(rows, 'pop')), label: 'Population in flood zones' },
      { icon: 'water', value: fmt(n), label: 'Locations in flood zones' },
      { icon: 'alert', value: pct(sum(rows.filter((r) => r.Flood_risk >= 3), 'n'), n), label: 'At high or severe risk' },
    ],
    charts: [
      { type: 'donut', title: '% of population by flood risk', data: rows.map((r) => [level(r), r.pop]) },
      { type: 'columns', title: 'Locations by flood risk (100-year RP)', data: rows.map((r) => [level(r), r.n]) },
    ],
  }
}
