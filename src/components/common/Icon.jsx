// `line` draws the path as a 1.8px outline instead of a filled shape.
export default function Icon({ d, size = 24, line = false }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      {line
        ? <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        : <path d={d} fill="currentColor" />}
    </svg>
  )
}
