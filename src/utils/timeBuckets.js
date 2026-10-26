const DAY = 24 * 60 * 60 * 1000
const WEEK = 7 * DAY
// Longer spans are shown per week so a year is ~52 points instead of 365.
const DAILY_MAX_DAYS = 62

/**
 * Turns per-day rows ({ [dateField]: ms, [valueField]: n }) into a continuous series
 * [[bucketStartMs, total]], with empty days/weeks filled in as 0.
 * Returns { data, step } where step is 'day' or 'week'.
 */
export function toTimeSeries(rows, dateField, valueField) {
  const dated = rows.filter((r) => r[dateField] != null)
  if (!dated.length) return { data: [], step: 'day' }
  const times = dated.map((r) => r[dateField])
  const first = Math.min(...times)
  const last = Math.max(...times)
  const step = last - first > DAILY_MAX_DAYS * DAY ? 'week' : 'day'
  const size = step === 'week' ? WEEK : DAY
  const start = Math.floor(first / DAY) * DAY

  const totals = new Map()
  dated.forEach((r) => {
    const key = start + Math.floor((r[dateField] - start) / size) * size
    totals.set(key, (totals.get(key) || 0) + (r[valueField] || 0))
  })
  const data = []
  for (let t = start; t <= last; t += size) data.push([t, totals.get(t) || 0])
  return { data, step }
}

export const formatDay = (ms, withYear = true) =>
  new Date(ms).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(withYear && { year: 'numeric' }),
    timeZone: 'UTC',
  })
