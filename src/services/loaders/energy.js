import { queryStats as stats } from '../statsQuery'
import { fmt, pct, sum } from '../../utils/format'

const RENEWABLE = ['solar', 'wind', 'hydropower', 'geothermal', 'bioenergy']

export default async function energy(view, g) {
  const rows = await stats(view, 'Power Plants', [['sum', 'Capacity__MW_', 'mw'], ['count', 'OBJECTID', 'n']], 'Type', g)
  const mw = sum(rows, 'mw')
  const renewable = sum(rows.filter((r) => RENEWABLE.includes(r.Type)), 'mw')
  return {
    kpis: [
      { icon: 'bolt', value: fmt(sum(rows, 'n')), label: 'Power plants' },
      { icon: 'gauge', value: `${fmt(mw)} MW`, label: 'Installed capacity' },
      { icon: 'leaf', value: pct(renewable, mw), label: 'Renewable share of capacity' },
    ],
    charts: [
      { type: 'donut', title: '% of capacity by type of energy', data: rows.map((r) => [r.Type, r.mw]) },
      { type: 'columns', title: 'Power plants by type', data: rows.map((r) => [r.Type, r.n]).sort((a, b) => b[1] - a[1]) },
    ],
    source: 'Global Energy Monitor',
  }
}
