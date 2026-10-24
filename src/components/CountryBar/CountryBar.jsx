import { motion, useReducedMotion } from 'framer-motion'
import { COUNTRIES, flagUrl } from '../../config/filters'
import { useCountryZoom } from '../../hooks/useCountryZoom'
import './CountryBar.css'

// Row of flag tiles floating at the bottom of the map, between the side cards.
// `inset` is the space the cards take ({ left, right } in px). Clicking the selected flag again clears it.
export default function CountryBar({ view, inset }) {
  const [selected, onSelect] = useCountryZoom(view)
  const reduceMotion = useReducedMotion()
  const disabled = !view

  return (
    <div className="country-bar" style={{ left: inset.left, right: inset.right }}>
      <motion.div
        className="country-strip"
        role="group"
        aria-label="Zoom to country"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {COUNTRIES.map((c) => {
          const active = c.name === selected
          // Once a country is picked, the other flags fade to grey.
          const dimmed = selected != null && !active
          return (
            <motion.button
              key={c.name}
              type="button"
              className={`country-tile${active ? ' on' : ''}`}
              aria-pressed={active}
              aria-label={c.name}
              title={c.name}
              disabled={disabled}
              onClick={() => onSelect(active ? null : c.name)}
              animate={{ opacity: dimmed ? 0.5 : 1, filter: dimmed ? 'grayscale(1)' : 'grayscale(0)' }}
              whileHover={disabled ? undefined : { opacity: 1, filter: 'grayscale(0)', ...(reduceMotion ? {} : { y: -2 }) }}
              whileTap={reduceMotion || disabled ? undefined : { scale: 0.95 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <img src={flagUrl(c.code)} alt="" loading="lazy" draggable="false" />
              <span className="country-name">{c.short ?? c.name}</span>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
