import { useEffect, useState } from 'react'
import { DEFAULT_PERIOD, PERIODS } from '../config/filters'
import { applyEventFilter, latestEventDate, periodWhere } from '../services/eventPeriod'

/**
 * Selected Security period, applied to the ACLED layers on the map.
 * Returns { period, setPeriod, latest, where }: `latest` is the newest event date (ms),
 * `where` the active date clause (pass it to anything that must refresh when it changes).
 */
export function useEventPeriod(view) {
  const [period, setPeriod] = useState(DEFAULT_PERIOD)
  const [latest, setLatest] = useState(null)

  useEffect(() => {
    if (!view) return
    let cancelled = false
    latestEventDate(view)
      .then((date) => !cancelled && setLatest(date))
      .catch(() => {}) // Without a date the filter stays on the full year.
    return () => {
      cancelled = true
    }
  }, [view])

  const where = periodWhere(latest, PERIODS.find((p) => p.id === period)?.days)

  useEffect(() => {
    if (view) applyEventFilter(view.map, where)
  }, [view, where])

  return { period, setPeriod, latest, where }
}
