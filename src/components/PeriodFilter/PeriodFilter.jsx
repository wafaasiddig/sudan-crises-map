import { motion, useReducedMotion } from 'framer-motion'
import { PERIODS } from '../../config/filters'
import './PeriodFilter.css'

// Past week / month / year buttons for the Security tab; the white highlight slides to the selected one.
export default function PeriodFilter({ period, onChange, latest }) {
  const reduceMotion = useReducedMotion()
  const disabled = !latest

  return (
    <div className="period-filter">
      <div className="period-buttons" role="radiogroup" aria-label="Time period">
        {PERIODS.map((p) => {
          const on = p.id === period
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              className={on ? 'on' : ''}
              disabled={disabled}
              onClick={() => onChange(p.id)}
            >
              {on && (
                <motion.span
                  layoutId="period-highlight"
                  className="period-highlight"
                  transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
                />
              )}
              <span className="period-label">{p.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
