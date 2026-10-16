import Icon from '../common/Icon'
import { ICONS } from '../common/icons'
import '../common/Skeleton.css'
import './KpiRow.css'

// Three headline figures; shows skeletons until the first result arrives.
export default function KpiRow({ result, loading }) {
  const kpis = result?.kpis ?? [{}, {}, {}]
  return (
    <div className={`kpi-row${loading && result ? ' is-loading' : ''}`}>
      {kpis.map((k, i) => (
        <div className="kpi" key={k.label || i}>
          <span className="kpi-icon">{k.icon ? <Icon d={ICONS[k.icon]} size={40} /> : <span className="sk sk-icon" />}</span>
          <div className="kpi-text">
            <div className="kpi-value">{k.value ?? <span className="sk sk-num" />}</div>
            <div className="kpi-label">{k.label ?? <span className="sk sk-text" />}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
