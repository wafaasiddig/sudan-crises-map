import { queryStats as stats } from '../statsQuery'
import { fmt, sum } from '../../utils/format'

// Health facility types with the original app's chart colours (they match the map symbols).
const OTHER = 'other'
const AMENITY = [
  ['clinic', 'Clinic', '#fb8c00'],
  ['health_post', 'Health post', '#77b484'],
  ['hospital', 'Hospital', '#b71c1c'],
  [OTHER, 'Undefined', '#d6d6d6'],
]

export default async function services(view, g) {
  const [health, [schools = {}]] = await Promise.all([
    stats(view, 'Healthsites', [['count', 'ObjectId', 'n']], ['countryName', 'amenity'], g),
    stats(view, 'Schools (JRC, Giga, OSM)', [['count', 'ObjectId', 'n']], null, g),
  ])
  const facilities = sum(health, 'n')
  const byCountry = {}
  const byType = {}
  health.forEach((r) => {
    const values = (byCountry[r.countryName || 'Unknown'] ??= {})
    const key = AMENITY.some(([k]) => k === r.amenity) ? r.amenity : OTHER
    values[key] = (values[key] || 0) + r.n
    byType[key] = (byType[key] || 0) + r.n
  })
  // Like the original app, the Services tab has a single chart.
  return {
    kpis: [
      { icon: 'health', value: fmt(facilities), label: 'Health facilities' },
      { icon: 'education', value: fmt(schools.n), label: 'Schools' },
      { icon: 'flag', value: fmt(Object.keys(byCountry).length), label: 'Countries covered' },
    ],
    charts: [
      {
        type: 'stackedBars',
        title: 'Healthsites by country and type',
        series: AMENITY.filter(([k]) => byType[k]),
        data: Object.entries(byCountry),
      },
    ],
    source: 'healthsites.io (OSM); JRC, Giga, OSM',
  }
}
