import { queryStats as stats } from '../statsQuery'
import { fmt, pct } from '../../utils/format'

const AGE = [
  ['Children_total', 'Children (0–17)'],
  ['Adult_total', 'Adults (18–59)'],
  ['Elderly_total', 'Elderly (60+)'],
]

export default async function population(view, g) {
  const [row = {}] = await stats(
    view,
    'Loc_UNHCR_enriched',
    [
      ['sum', 'total', 'total'],
      ['sum', 'F_total', 'female'],
      ['sum', 'M_total', 'male'],
      ['count', 'OBJECTID', 'n'],
      ...AGE.map(([f]) => ['sum', f, f]),
    ],
    null,
    g,
  )
  return {
    kpis: [
      { icon: 'people', value: fmt(row.total), label: 'Displaced & returnee population' },
      { icon: 'pin', value: fmt(row.n), label: 'Reporting locations' },
      { icon: 'female', value: pct(row.female, row.female + row.male), label: 'Female share' },
    ],
    charts: [
      { type: 'donut', title: '% of population by gender', data: [['Female', row.female], ['Male', row.male]] },
      { type: 'columns', title: 'Population by age group', data: AGE.map(([f, label]) => [label, row[f]]) },
    ],
  }
}
