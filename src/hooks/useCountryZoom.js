import { useEffect, useState } from 'react'
import { ALL_COUNTRIES, COUNTRIES, DEFAULT_COUNTRY } from '../config/filters'

// Map target for a country name; null means "All countries" (the web map's initial view).
const targetFor = (view, name) => {
  const c = COUNTRIES.find((x) => x.name === name) ?? ALL_COUNTRIES
  return c.center ? { center: c.center, zoom: c.zoom } : view.map.initialViewProperties?.viewpoint
}

// Selected country + a function that selects one and zooms the map to it.
export function useCountryZoom(view) {
  const [country, setCountry] = useState(DEFAULT_COUNTRY)

  // Start on the default country as soon as the map is ready (no fly-in animation).
  useEffect(() => {
    if (view) view.goTo(targetFor(view, DEFAULT_COUNTRY), { animate: false }).catch(() => {})
  }, [view])

  const zoomToCountry = (name) => {
    setCountry(name)
    if (!view) return
    const target = targetFor(view, name)
    // goTo rejects when a newer navigation interrupts it; that's expected.
    if (target) view.goTo(target, { duration: 800 }).catch(() => {})
  }

  return [country, zoomToCountry]
}
