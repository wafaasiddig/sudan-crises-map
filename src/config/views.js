import { L, POP } from './webmap'
import { ICONS } from '../components/common/icons'

/**
 * Each tab mirrors one view of the original app:
 *  groups  – top-level groups drawn and listed (in addition to ALWAYS_VISIBLE)
 *  on      – sublayers switched on inside those groups; `null` keeps the web map defaults
 */
export const VIEWS = [
  {
    id: 'population',
    accent: '#2563eb',
    icon: ICONS.linePeople,
    label: 'Population',
    groups: [L.population],
    on: null,
  },
  {
    id: 'security',
    accent: '#dc2626',
    icon: ICONS.lineShield,
    label: 'Security',
    groups: [L.security, L.population],
    on: ['19d1af95f74-layer-41', POP.routes],
  },
  {
    id: 'services',
    accent: '#7c3aed',
    icon: ICONS.lineMedical,
    label: 'Services',
    groups: [L.services, L.population],
    on: ['19cfe653521-layer-41', '19cf7c1edc1-layer-41', POP.routes],
  },
  {
    id: 'climate',
    accent: '#0d9488',
    icon: ICONS.lineDrop,
    label: 'Climate hazards',
    groups: [L.climate, L.population],
    on: ['19d8964ac43-layer-51', '19cdf7943f8-layer-34', POP.routes],
  },
  {
    id: 'energy',
    accent: '#d97706',
    icon: ICONS.lineBolt,
    label: 'Energy',
    groups: [L.energy, L.population],
    // The electricity grid remains available in Layers, initially unchecked.
    on: ['19d5358ba97-layer-42', POP.poc],
  },
]

export const DATA_SOURCES = 'Data: UNHCR, ACLED, OCHA, Global Energy Monitor, healthsites.io'

export const DISCLAIMER =
  'Due to ongoing data collection, population figures are not available for all displaced and returnee locations and should therefore be considered indicative only. They represent only a partial count of the total affected population.'
