// UNHCR "Sudan Crisis master webmap" — the same web map the original Experience Builder app uses.
export const PORTAL_URL = 'https://unhcr.maps.arcgis.com'
export const WEBMAP_ID = 'a6ac17228c4b47529f319572be4480b4'

// Top-level group / layer ids in the web map.
export const L = {
  hidden: '19d5366415f-layer-46',
  landcover: '19d012029e1-layer-111',
  admin: '19c98e887da-layer-30',
  climate: '19cdd8f8263-layer-37',
  energy: '19d5358de22-layer-43',
  countryTiles: '19d0c57a458-layer-44',
  population: '19c98ee7d83-layer-32',
  services: '19cdd8f06b0-layer-34',
  security: '19c98fef0e3-layer-39',
}

// Population and migration sublayers
const POP = {
  density: '19ce2f975ff-layer-37',
  settlements: '19c98eec3f5-layer-33',
  poc: 'e279b1568eff415994704e452286d447',
  aggrAdmin2: '19d66a472ed-layer-51',
  ochaAdm2: '19d2b450d02-layer-46',
  routes: '19d6d1138f3-layer-62',
  crossings: '196219a7c1b-layer-72',
}

// Layers that are always drawn regardless of tab.
export const ALWAYS_VISIBLE = [L.admin, L.countryTiles]
// Layers that never appear in the layer list.
export const NEVER_LISTED = [L.hidden, L.countryTiles]

/**
 * Each tab mirrors one view of the original app:
 *  groups  – top-level groups drawn and listed (in addition to ALWAYS_VISIBLE)
 *  on      – sublayers switched on inside those groups; `null` keeps the web map defaults
 */
export const VIEWS = [
  {
    id: 'population',
    accent: '#2563eb',
    icon: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.3 0-7 1.7-7 4.5V20h14v-2.5C16 14.7 12.3 13 9 13zm7.5-2a3.5 3.5 0 1 0-1.2-6.8 5.9 5.9 0 0 1 0 6.6c.4.1.8.2 1.2.2zm1.6 2.2A5.4 5.4 0 0 1 20 17.5V20h3v-2.5c0-2.2-2.3-3.7-4.9-4.3z',
    label: 'Population',
    groups: [L.population],
    on: null,
  },
  {
    id: 'security',
    accent: '#dc2626',
    icon: 'M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5zm-1 5h2v6h-2zm0 8h2v2h-2z',
    label: 'Security',
    groups: [L.security, L.population],
    on: ['19d1af95f74-layer-41', POP.routes],
  },
  {
    id: 'services',
    accent: '#7c3aed',
    icon: 'M10 3h4v5h5v4h-5v5h-4v-5H5V8h5zM4 19h16v2H4z',
    label: 'Services',
    groups: [L.services, L.population],
    on: ['19cfe653521-layer-41', '19cf7c1edc1-layer-41', POP.routes],
  },
  {
    id: 'climate',
    accent: '#0d9488',
    icon: 'M12 2c-.4 0-.8.2-1 .6C9.3 5.4 6 10.3 6 14a6 6 0 0 0 12 0c0-3.7-3.3-8.6-5-11.4-.2-.4-.6-.6-1-.6zm-2.5 12.5c.3 1.3 1.3 2.3 2.6 2.5l-.3 2a5 5 0 0 1-4.2-4z',
    label: 'Climate hazards',
    groups: [L.climate, L.population],
    on: ['19d8964ac43-layer-51', '19cdf7943f8-layer-34', POP.routes],
  },
  {
    id: 'energy',
    accent: '#d97706',
    icon: 'M13 2 4 14h6l-1 8 9-12h-6z',
    label: 'Energy',
    groups: [L.energy, L.population],
    on: ['19d5358ba97-layer-42', '19d538ea994-layer-47', POP.poc],
  },
]

export const DISCLAIMER =
  'Due to ongoing data collection, population figures are not available for all displaced and returnee locations and should therefore be considered indicative only. They represent only a partial count of the total affected population.'
