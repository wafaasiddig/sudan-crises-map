import { SCOPES } from '../../config/filters'
import './FilterBar.css'

// Statistics scope, shown at the top of the Insights card. (Country flags live in CountryBar.)
export default function FilterBar({ scope, onScopeChange }) {
  return (
    <div className="filters">
      <div className="filter">
        <span className="filter-label" id="scope-label">Statistics for</span>
        <div className="segmented" role="radiogroup" aria-labelledby="scope-label" onKeyDown={(event) => {
          const index = SCOPES.findIndex((item) => item.id === scope)
          const next = ['ArrowRight', 'ArrowDown'].includes(event.key) ? (index + 1) % SCOPES.length
            : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (index - 1 + SCOPES.length) % SCOPES.length
              : event.key === 'Home' ? 0 : event.key === 'End' ? SCOPES.length - 1 : null
          if (next === null) return
          event.preventDefault()
          onScopeChange(SCOPES[next].id)
          event.currentTarget.querySelectorAll('[role="radio"]')[next].focus()
        }}>
          {SCOPES.map((s) => (
            <button key={s.id} role="radio" aria-checked={scope === s.id} tabIndex={scope === s.id ? 0 : -1} className={scope === s.id ? 'on' : ''} onClick={() => onScopeChange(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
