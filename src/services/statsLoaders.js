import { queryStats as stats } from './statsQuery'
import { fmt, pct, sum } from '../utils/format'

const AGE = [
  ['Children_total', 'Children (0–17)'],
  ['Adult_total', 'Adults (18–59)'],
  ['Elderly_total', 'Elderly (60+)'],
]

/**
 * One loader per theme (keyed by view id). Each returns
 *  kpis   – three { icon, value, label } tiles (icon is a key of ICONS)
 *  charts – a donut and a columns chart as { type, title, data: [[label, value]] }
 *  source – optional attribution for the footnote
 */
export const LOADERS = {
  async population(view, g) {
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
  },
  async security(view, g) {
    const rows = await stats(view, 'Violent events', [['count', 'OBJECTID', 'events'], ['sum', 'fatalities', 'fatalities']], 'event_type', g)
    const events = sum(rows, 'events')
    const civilians = rows.find((r) => r.event_type === 'Violence against civilians')?.events || 0
    return {
      kpis: [
        { icon: 'alert', value: fmt(events), label: 'Violent events (12 months)' },
        { icon: 'cross', value: fmt(sum(rows, 'fatalities')), label: 'Reported fatalities' },
        { icon: 'people', value: pct(civilians, events), label: 'Events targeting civilians' },
      ],
      charts: [
        { type: 'donut', title: '% of events by type', data: rows.map((r) => [r.event_type, r.events]) },
        {
          type: 'columns',
          title: 'Fatalities by event type',
          data: rows.map((r) => [r.event_type, r.fatalities]).sort((a, b) => b[1] - a[1]),
        },
      ],
      source: 'ACLED, rolling 365 days',
    }
  },
  async services(view, g) {
    const [health, [schools = {}]] = await Promise.all([
      stats(view, 'Healthsites', [['count', 'ObjectId', 'n']], 'countryName', g),
      stats(view, 'Schools (JRC, Giga, OSM)', [['count', 'ObjectId', 'n']], null, g),
    ])
    const facilities = sum(health, 'n')
    return {
      kpis: [
        { icon: 'hospital', value: fmt(facilities), label: 'Health facilities' },
        { icon: 'school', value: fmt(schools.n), label: 'Schools' },
        { icon: 'flag', value: fmt(health.filter((r) => r.countryName).length), label: 'Countries covered' },
      ],
      charts: [
        { type: 'donut', title: '% of sites: health facilities vs schools', data: [['Health facilities', facilities], ['Schools', schools.n]] },
        { type: 'columns', title: 'Health facilities by country', data: health.slice(0, 8).map((r) => [r.countryName || 'Unknown', r.n]) },
      ],
      source: 'healthsites.io (OSM); JRC, Giga, OSM',
    }
  },
  async climate(view, g) {
    const rows = await stats(
      view,
      'Displaced & returnee locations in flood zones',
      [['count', 'OBJECTID', 'n'], ['sum', 'total', 'pop']],
      'Flood_risk',
      g,
    )
    rows.sort((a, b) => a.Flood_risk - b.Flood_risk)
    const n = sum(rows, 'n')
    const level = (r) => ['', 'Low', 'Medium', 'High', 'Severe'][r.Flood_risk] || String(r.Flood_risk)
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
  },
  async energy(view, g) {
    const rows = await stats(view, 'Power Plants', [['sum', 'Capacity__MW_', 'mw'], ['count', 'OBJECTID', 'n']], 'Type', g)
    const mw = sum(rows, 'mw')
    const renewable = sum(
      rows.filter((r) => ['solar', 'wind', 'hydropower', 'geothermal', 'bioenergy'].includes(r.Type)),
      'mw',
    )
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
  },
}
