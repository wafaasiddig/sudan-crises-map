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
export const POP = {
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
// Reference groups that stay in the layer list even when the tab doesn't draw them.
export const REFERENCE_TITLES = ['Admin boundaries', 'Landcover']
