import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { fmt } from '../../../utils/format'
import './HoverTooltip.css'

const count = (n, one, many) => `${fmt(n)} ${n === 1 ? one : many}`

// Small card above the hovered map bubble: place name, fatalities and (for clusters) the event count.
export default function HoverTooltip({ info }) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {info && (
        <motion.div
          key="hover-tooltip"
          className="hover-tooltip"
          role="tooltip"
          style={{ left: info.x, top: info.y }}
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.15 }}
        >
          <strong>{info.name || 'Unknown location'}</strong>
          <span>
            {info.fatalities == null ? 'Fatalities unknown' : count(info.fatalities, 'fatality', 'fatalities')}
            {info.events > 1 && ` · ${count(info.events, 'event', 'events')}`}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
