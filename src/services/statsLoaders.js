import population from './loaders/population'
import security from './loaders/security'
import services from './loaders/services'
import climate from './loaders/climate'
import energy from './loaders/energy'

/**
 * One loader per theme (keyed by view id), each in its own file under ./loaders.
 * A loader is called as (view, geometry) and returns
 *  kpis    – three { icon, value, label } tiles (icon is a key of ICONS); Security has none
 *  charts  – usually a donut and a columns chart as { type, title, data: [[label, value]] };
 *            a 'stackedBars' chart also takes series (see components/charts/StackedBars),
 *            a 'timeline' chart takes data: [[ms, value]] and step (see components/charts/Timeline)
 *  source  – optional attribution for the footnote
 *  summary – optional one-line description of what the figures cover
 */
export const LOADERS = { population, security, services, climate, energy }
