import Logo from '../common/Logo'
import Icon from '../common/Icon'
import { VIEWS, DATA_SOURCES } from '../../config/views'
import './Sidebar.css'

export default function Sidebar({ activeView, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Logo />
        <div>
          <div className="brand-name">Sudan Crisis</div>
          <div className="brand-sub">Regional Map</div>
        </div>
      </div>

      <nav className="nav" aria-label="Themes">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            className={`nav-item${v.id === activeView.id ? ' active' : ''}`}
            aria-current={v.id === activeView.id ? 'page' : undefined}
            onClick={() => onSelect(v)}
          >
            <Icon d={v.icon} size={20} />
            <span>{v.label}</span>
          </button>
        ))}
      </nav>

      <p className="sidebar-foot">{DATA_SOURCES}</p>
    </aside>
  )
}
