function findLayer(view, title) {
  return view.map.allLayers.find((l) => l.title === title && l.type === 'feature')
}

// Statistics query, optionally limited to a geometry; honours the layer's definition expression.
export async function queryStats(view, title, outStatistics, groupBy, geometry) {
  const layer = findLayer(view, title)
  if (!layer) throw new Error(`Statistics layer unavailable: ${title}`)
  await layer.load()
  const q = layer.createQuery()
  if (geometry) q.geometry = geometry
  q.returnGeometry = false
  q.outStatistics = outStatistics.map(([type, field, out]) => ({
    statisticType: type,
    onStatisticField: field,
    outStatisticFieldName: out,
  }))
  if (groupBy) {
    q.groupByFieldsForStatistics = [].concat(groupBy)
    q.orderByFields = [`${outStatistics[0][2]} DESC`]
  }
  const res = await layer.queryFeatures(q)
  return res.features.map((f) => f.attributes)
}
