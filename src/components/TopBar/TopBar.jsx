import { useId } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import Logo from '../common/Logo'
import Icon from '../common/Icon'
import { VIEWS, DATA_SOURCES } from '../../config/views'
import './TopBar.css'

// Light header: brand, the five themes as pill tabs, and the data sources.
export default function TopBar({ activeView, onSelect }) {
  const tabsId = useId()
  const reduceMotion = useReducedMotion()
  const navigateThemes = (event) => {
    const index = VIEWS.findIndex((view) => view.id === activeView.id)
    const next = event.key === 'ArrowRight' ? (index + 1) % VIEWS.length
      : event.key === 'ArrowLeft' ? (index - 1 + VIEWS.length) % VIEWS.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? VIEWS.length - 1 : null
    if (next === null) return
    event.preventDefault()
    onSelect(VIEWS[next])
    event.currentTarget.querySelectorAll('[role="tab"]')[next].focus()
  }
  return (
    <header className="topbar">
      <div className="brand">
        <Logo size={32} />
        <div>
          <div className="brand-title">Sudan Regional Crisis</div>
          <div className="brand-sub">Regional map · 8 countries</div>
        </div>
      </div>

      <LayoutGroup id={tabsId}>
      <motion.nav layoutScroll className="tabs" role="tablist" aria-label="Map themes" onKeyDown={navigateThemes}>
        {VIEWS.map((v, index) => {
          const active = v.id === activeView.id
          return (
            <button
              key={v.id}
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              aria-controls="map-workspace"
              className={`tab${active ? ' active' : ''}`}
              style={{ '--tab-accent': v.accent, '--tab-delay': `${index * 60}ms` }}
              onClick={() => onSelect(v)}
            >
              {active && (
                <motion.span
                  className="tab-highlight"
                  layoutId="active-tab"
                  aria-hidden="true"
                  initial={false}
                  animate={{ backgroundColor: v.accent }}
                  transition={reduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              <Icon d={v.icon} size={18} />
              <span>{v.label}</span>
            </button>
          )
        })}
      </motion.nav>
      </LayoutGroup>

      <div className="topbar-meta" title={DATA_SOURCES}>
        <span className="live-dot" aria-hidden="true" />
        {DATA_SOURCES}
      </div>
    </header>
  )
}
