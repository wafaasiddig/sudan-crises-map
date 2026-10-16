import { useState } from 'react'
import Icon from '../common/Icon'
import { ICONS } from '../common/icons'
import './MapTools.css'

const TOOLS = [
  { id: 'layers', title: 'Layers', icon: ICONS.layers },
  { id: 'legend', title: 'Legend', icon: ICONS.legend },
  { id: 'basemap', title: 'Basemaps', icon: ICONS.basemap },
]

// Tool buttons with one popover each; the ArcGIS widgets mount into `panelRefs[tool.id]`.
export default function MapTools({ ref, panelRefs }) {
  const [openTool, setOpenTool] = useState(null)

  return (
    <div ref={ref} className="map-tools">
      <div className="tool-row">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`tool-btn${openTool === t.id ? ' active' : ''}`}
            title={t.title}
            aria-label={t.title}
            aria-pressed={openTool === t.id}
            onClick={() => setOpenTool(openTool === t.id ? null : t.id)}
          >
            <Icon d={t.icon} size={18} />
          </button>
        ))}
      </div>
      {TOOLS.map((t) => (
        <div key={t.id} className={`tool-popover tool-${t.id}`} hidden={openTool !== t.id}>
          <div className="tool-popover-head">
            <span>{t.title}</span>
            <button onClick={() => setOpenTool(null)} aria-label="Close">
              <Icon d={ICONS.close} size={16} />
            </button>
          </div>
          <div ref={panelRefs[t.id]} className="tool-popover-body" />
        </div>
      ))}
    </div>
  )
}
