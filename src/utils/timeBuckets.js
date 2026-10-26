const DAY = 24 * 60 * 60 * 1000
const WEEK = 7 * DAY
// Longer spans are shown per week, and spans over ~6 months per month (a year is 12 points).
const DAILY_MAX_DAYS = 62
const WEEKLY_MAX_DAYS = 183
const monthStart = (ms) => {
  const d = new Date(ms)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth())
}
const nextMonth = (ms) => {
  const d = new Date(ms)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1)
}

/**
 * Turns per-day rows ({ [dateField]: ms, [valueField]: n }) into a continuous series
 * [[bucketStartMs, total]], with empty days/weeks filled in as 0.
 * Returns { data, step } where step is 'day', 'week' or 'month'.
 */
export function toTimeSeries(rows, dateField, valueField) {
  const dated = rows.filter((r) => r[dateField] != null)
  if (!dated.length) return { data: [], step: 'day' }
  const times = dated.map((r) => r[dateField])
  const first = Math.min(...times)
  const last = Math.max(...times)
  const span = last - first
  const step = span > WEEKLY_MAX_DAYS * DAY ? 'month' : span > DAILY_MAX_DAYS * DAY ? 'week' : 'day'
  const size = step === 'week' ? WEEK : DAY
  const start = step === 'month' ? monthStart(first) : Math.floor(first / DAY) * DAY
  const bucket = (t) => (step === 'month' ? monthStart(t) : start + Math.floor((t - start) / size) * size)
  const next = (t) => (step === 'month' ? nextMonth(t) : t + size)

  const totals = new Map()
  dated.forEach((r) => {
    const key = bucket(r[dateField])
    totals.set(key, (totals.get(key) || 0) + (r[valueField] || 0))
  })
  const data = []
  for (let t = start; t <= last; t = next(t)) data.push([t, totals.get(t) || 0])
  return { data, step }
}

export const formatDay = (ms, withYear = true) =>
  new Date(ms).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(withYear && { year: 'numeric' }),
    timeZone: 'UTC',
  })

const MAX_MONTH_TICKS = 5

/**
 * Month-start dates between two times for the x axis, spaced every 1, 2, 3, 6 or 12 months
 * so there are at most ~5 ticks (e.g. Jan, Apr, Jul, Oct for a year). Returns null for short
 * spans, letting the chart pick its own day ticks.
 */
export function monthTicks(first, last) {
  const start = new Date(first)
  let y = start.getUTCFullYear()
  let m = start.getUTCMonth() + 1 // first full month
  const months = []
  for (let t = Date.UTC(y, m); t <= last; t = Date.UTC(y, ++m)) months.push(new Date(t))
  if (months.length < 2) return null
  const every = [1, 2, 3, 6, 12].find((n) => months.length / n <= MAX_MONTH_TICKS) || 12
  return months.filter((d) => d.getUTCMonth() % every === 0)
}

// "Apr", or "Jan\n2026" for January (the chart draws "\n" as a second line).
export const formatMonthTick = (d) => {
  const month = d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })
  return d.getUTCMonth() === 0 ? `${month}\n${d.getUTCFullYear()}` : month
}

export const formatMonth = (ms) =>
  new Date(ms).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
