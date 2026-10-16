import './Panel.css'

// White card used by the map and chart sections.
export default function Panel({ title, className = '', loading = false, children }) {
  return (
    <section className={`panel ${className}${loading ? ' is-loading' : ''}`}>
      {title && <h3 className="panel-title">{title}</h3>}
      {children}
    </section>
  )
}
