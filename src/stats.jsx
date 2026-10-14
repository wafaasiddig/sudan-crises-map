import { useEffect, useState } from 'react'
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'

export const fmt = (n) => (n == null || Number.isNaN(n) ? '–' : Math.round(n).toLocaleString('en-US'))
const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '–')
const sum = (rows, k) => rows.reduce((s, r) => s + (r[k] || 0), 0)

function findLayer(view, title) {
  return view.map.allLayers.find((l) => l.title === title && l.type === 'feature')
}

// Statistics query, optionally limited to a geometry; honours the layer's definition expression.
async function stats(view, title, outStatistics, groupBy, geometry) {
  const layer = findLayer(view, title)
  if (!layer) return []
  await layer.load()
  const q = layer.createQuery()
  if (geometry) q.geometry = geometry
  q.returnGeometry = false
  q.outStatistics = outStatistics.map(([type, field, out]) => ({
    statisticType: type,
    onStatisticField: field,
    outStatisticFieldName: out,
  }))
  if (groupBy) {
    q.groupByFieldsForStatistics = [groupBy]
    q.orderByFields = [`${outStatistics[0][2]} DESC`]
  }
  const res = await layer.queryFeatures(q)
  return res.features.map((f) => f.attributes)
}

const AGE = [
  ['Children_total', 'Children (0–17)'],
  ['Adult_total', 'Adults (18–59)'],
  ['Elderly_total', 'Elderly (60+)'],
]

// Icons for the KPI row (24×24 paths).
const ICONS = {
  people:
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.3 0-7 1.7-7 4.5V20h14v-2.5C16 14.7 12.3 13 9 13zm7.5-2a3.5 3.5 0 1 0-1.2-6.8 5.9 5.9 0 0 1 0 6.6c.4.1.8.2 1.2.2zm1.6 2.2A5.4 5.4 0 0 1 20 17.5V20h3v-2.5c0-2.2-2.3-3.7-4.9-4.3z',
  pin: 'M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z',
  female: 'M12 2a6 6 0 0 0-1 11.9V16H8v2h3v4h2v-4h3v-2h-3v-2.1A6 6 0 0 0 12 2zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
  alert: 'M12 2 1 21h22zm-1 7h2v6h-2zm0 8h2v2h-2z',
  cross: 'M10 3h4v5h5v4h-5v5h-4v-5H5V8h5zM4 19h16v2H4z',
  hospital: 'M3 21V7l9-4 9 4v14h-7v-5h-4v5zm8-13v2H9v2h2v2h2v-2h2v-2h-2V8z',
  school: 'M12 3 1 9l11 6 9-4.9V17h2V9zM5 13.2v4L12 21l7-3.8v-4L12 17z',
  flag: 'M5 21V4h9l.4 2H20v10h-7l-.4-2H7v7z',
  water: 'M12 2c-.4 0-.8.2-1 .6C9.3 5.4 6 10.3 6 14a6 6 0 0 0 12 0c0-3.7-3.3-8.6-5-11.4-.2-.4-.6-.6-1-.6z',
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6z',
  gauge: 'M12 4a10 10 0 0 0-8.7 15h17.4A10 10 0 0 0 12 4zm1 9.7-1.4 1.4-1.4-1.4L15.5 8z',
  leaf: 'M20 3C9 3 4 9 4 15c0 1.8.5 3.4 1.2 4.6L3.3 21.5l1.4 1.4 2-2C7.9 21.6 9.4 22 11 22c7 0 10-7 9-19zM8.5 18.9C10 15 13 11.5 16 10c-3.5 2.5-5.7 6-6.6 9.3-.3-.1-.6-.2-.9-.4z',
}

const LOADERS = {
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

// Single-hue blue palette, alternating dark and light so neighbours stay distinct.
const PALETTE = ['#0f6cbd', '#9cc4e8', '#2f5597', '#5b9bd5', '#1f4e79', '#bdd7ee', '#7fa7d1', '#dbe8f5']

/** Loads the active theme's statistics, for the map extent or the whole region. */
export function useStats(view, activeView, scope) {
  const [state, setState] = useState({ result: null, loading: true, error: null })

  useEffect(() => {
    if (!view) return
    let cancelled = false
    let timer
    const run = () => {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        setState((s) => ({ ...s, loading: true }))
        try {
          const result = await LOADERS[activeView.id](view, scope === 'extent' ? view.extent : null)
          if (!cancelled) setState({ result, loading: false, error: null })
        } catch (e) {
          if (!cancelled) setState((s) => ({ ...s, loading: false, error: e.message }))
        }
      }, 400)
    }
    setState({ result: null, loading: true, error: null })
    run()
    const handle =
      scope === 'extent' &&
      reactiveUtils.watch(
        () => view.stationary,
        (stationary) => stationary && run(),
      )
    return () => {
      cancelled = true
      clearTimeout(timer)
      if (handle) handle.remove()
    }
  }, [view, activeView, scope])

  return state
}

function Icon({ d, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={d} fill="currentColor" />
    </svg>
  )
}

export function KpiRow({ result, loading }) {
  const kpis = result?.kpis ?? [{}, {}, {}]
  return (
    <div className={`kpi-row${loading && result ? ' is-loading' : ''}`}>
      {kpis.map((k, i) => (
        <div className="kpi" key={k.label || i}>
          <span className="kpi-icon">{k.icon ? <Icon d={ICONS[k.icon]} size={40} /> : <span className="sk sk-icon" />}</span>
          <div className="kpi-text">
            <div className="kpi-value">{k.value ?? <span className="sk sk-num" />}</div>
            <div className="kpi-label">{k.label ?? <span className="sk sk-text" />}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Donut with outside percentage labels and the legend underneath.
function Donut({ data }) {
  const clean = data.filter(([, v]) => v > 0)
  const total = clean.reduce((s, [, v]) => s + v, 0)
  if (!total) return <p className="empty">No data for this selection.</p>
  const R = 44
  const r = 26
  const pt = (rad, ang) => [80 + rad * Math.cos(ang), 60 + rad * Math.sin(ang)]
  let a0 = -Math.PI / 2
  const segs = clean.map(([label, v], i) => {
    const share = v / total
    const a1 = a0 + share * Math.PI * 2 - 1e-6
    const large = a1 - a0 > Math.PI ? 1 : 0
    const [x0, y0] = pt(R, a0)
    const [x1, y1] = pt(R, a1)
    const [x2, y2] = pt(r, a1)
    const [x3, y3] = pt(r, a0)
    const mid = (a0 + a1) / 2
    const [lx, ly] = pt(R + 12, mid)
    const seg = {
      label,
      v,
      share,
      color: PALETTE[i % PALETTE.length],
      d: `M${x0} ${y0}A${R} ${R} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 ${large} 0 ${x3} ${y3}Z`,
      lx,
      ly,
      anchor: Math.abs(Math.cos(mid)) < 0.2 ? 'middle' : Math.cos(mid) > 0 ? 'start' : 'end',
    }
    a0 = a1 + 1e-6
    return seg
  })
  return (
    <div className="donut">
      <svg viewBox="0 0 160 120" className="donut-svg" role="img" aria-label="Donut chart">
        {segs.map((s) => (
          <path key={s.label} d={s.d} fill={s.color} stroke="#fff" strokeWidth="1">
            <title>{`${s.label}: ${fmt(s.v)} (${(s.share * 100).toFixed(1)}%)`}</title>
          </path>
        ))}
        {segs
          .filter((s) => s.share >= 0.04)
          .map((s) => (
            <text key={s.label} x={s.lx} y={s.ly} textAnchor={s.anchor} dominantBaseline="middle" className="donut-label">
              {Math.round(s.share * 100)}%
            </text>
          ))}
      </svg>
      <ul className="chart-legend">
        {segs.map((s) => (
          <li key={s.label}>
            <span className="swatch" style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Vertical columns: share label on top, category below.
function Columns({ data }) {
  const total = data.reduce((s, [, v]) => s + (v || 0), 0)
  const max = Math.max(0, ...data.map(([, v]) => v || 0))
  if (!max) return <p className="empty">No data for this selection.</p>
  return (
    <div className="columns">
      {data.map(([label, v]) => (
        <div className="col" key={label} title={`${label}: ${fmt(v)}`}>
          <div className="col-plot">
            <span className="col-value">{Math.round(((v || 0) / total) * 100)}%</span>
            <span className="col-bar" style={{ height: `${((v || 0) / max) * 100}%` }} />
          </div>
          <span className="col-label">{label}</span>
        </div>
      ))}
    </div>
  )
}

export function ChartCard({ chart, loading }) {
  return (
    <section className={`panel chart-card${loading ? ' is-loading' : ''}`}>
      <h3 className="panel-title">{chart.title}</h3>
      {chart.type === 'donut' ? <Donut data={chart.data} /> : <Columns data={chart.data} />}
    </section>
  )
}
