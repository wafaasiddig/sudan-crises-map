import { useEffect, useState } from 'react'
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
import { LOADERS } from '../services/statsLoaders'

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
