import { ALWAYS_VISIBLE, NEVER_LISTED, REFERENCE_TITLES } from '../../config/webmap'

// Remember the web map's authored visibility so tabs can fall back to it.
export function snapshotDefaults(layers, out = new Map()) {
  layers.forEach((layer) => {
    out.set(layer.id, layer.visible)
    if (layer.layers) snapshotDefaults(layer.layers, out)
  })
  return out
}

function restoreDefaults(layer, defaults) {
  layer.visible = defaults.get(layer.id) ?? layer.visible
  layer.layers?.forEach((child) => restoreDefaults(child, defaults))
}

// Turn on the listed sublayers (and the groups that contain them); everything else off.
function applyOnList(group, on, defaults) {
  let anyOn = false
  group.layers?.forEach((child) => {
    if (on.includes(child.id)) {
      restoreDefaults(child, defaults)
      child.visible = true
      anyOn = true
    } else if (child.layers) {
      const childOn = applyOnList(child, on, defaults)
      child.visible = childOn
      anyOn ||= childOn
    } else {
      child.visible = false
    }
  })
  return anyOn
}

/** Shows the groups/sublayers a tab (see config/views) asks for and orders them on top. */
export function applyView(map, view, defaults) {
  map.layers.forEach((layer) => {
    const listed = view.groups.includes(layer.id)
    layer.listMode = NEVER_LISTED.includes(layer.id) ? 'hide' : 'show'
    if (ALWAYS_VISIBLE.includes(layer.id)) {
      layer.visible = true
    } else if (listed) {
      layer.visible = true
      if (view.on) applyOnList(layer, view.on, defaults)
      else layer.layers?.forEach((child) => restoreDefaults(child, defaults))
    } else {
      layer.visible = false
      // Keep unrelated groups out of the list, except the reference layers.
      if (!REFERENCE_TITLES.includes(layer.title)) layer.listMode = 'hide'
    }
  })
  // Listed groups first, in the order the tab defines.
  view.groups
    .slice()
    .reverse()
    .forEach((id) => {
      const layer = map.findLayerById(id)
      if (layer) map.reorder(layer, map.layers.length - 1)
    })
}
