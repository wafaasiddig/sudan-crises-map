import Icon from '../common/Icon'
import { ICONS, IMAGES } from '../common/icons'
import '../common/Skeleton.css'
import './KpiRow.css'

function KpiIcon({ name, size }) {
  if (IMAGES[name]) return <img src={IMAGES[name]} alt="" width={size} height={size} />
  if (name) return <Icon d={ICONS[name]} size={size} />
  return null
}

// Headline figures: the first as a large coloured card, the rest in a grid; skeletons until the first result.
export default function KpiRow({ result, loading }) {
  if (!result) {
    return (
      <div className="kpis">
        <div className="sk sk-hero" />
        <div className="kpi-grid">
          <div className="sk sk-kpi" />
          <div className="sk sk-kpi" />
        </div>
      </div>
    )
  }

  const [hero, ...rest] = result.kpis
  return (
    <div className={`kpis${loading ? ' is-loading' : ''}`}>
      <div className="kpi-hero">
        <div className="kpi-hero-text">
          <div className="kpi-label">{hero.label}</div>
          <div className="kpi-value">{hero.value}</div>
        </div>
        <span className="kpi-hero-icon">
          <KpiIcon name={hero.icon} size={28} />
        </span>
      </div>
      {rest.length > 0 && (
        <div className="kpi-grid">
          {rest.map((k) => (
            <div className="kpi" key={k.label}>
              <span className="kpi-icon">
                <KpiIcon name={k.icon} size={18} />
              </span>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
