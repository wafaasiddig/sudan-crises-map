import { useEffect, useState } from 'react'
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
import { LOADERS } from '../services/statsLoaders'

/**
 * Loads the active theme's statistics for the map extent or a selected admin.
 * `filter` is any layer filter in effect (e.g. the Security date clause); a change reloads the figures.
 */
export function useStats(view, activeView, scope, area, filter) {
  const [state, setState] = useState({ result: null, loading: true, error: null })

  useEffect(() => {
    if (!view) return
    let cancelled = false
    let timer
    let latest = 0
    const run = () => {
      const request = ++latest
      clearTimeout(timer)
      timer = setTimeout(async () => {
        setState((s) => ({ ...s, loading: true, error: null }))
        try {
          // Until an admin is clicked, "Selected Admin" shows the whole region.
          const geometry = scope === 'extent' ? view.extent : scope === 'selection' ? (area?.geometry ?? null) : null
          const result = await LOADERS[activeView.id](view, geometry)
          if (!cancelled && request === latest) setState({ result, loading: false, error: null })
        } catch (e) {
          if (!cancelled && request === latest) setState((s) => ({ ...s, loading: false, error: e.message }))
        }
      }, 400)
    }
    // Reset after subscribing, without triggering a synchronous effect render.
    queueMicrotask(() => {
      if (!cancelled) setState({ result: null, loading: true, error: null })
    })
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
  }, [view, activeView, scope, area, filter])

  return state
}
