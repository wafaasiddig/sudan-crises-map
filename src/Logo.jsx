// App mark: a folded map with a location pin, on the dashboard blue.
// Keep in sync with public/favicon.svg.
export default function Logo({ size = 34 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#0f6cbd" />
      <path d="M6 10.5 12 8.5v15l-6 2z" fill="#fff" />
      <path d="M12 8.5l8 2v15l-8-2z" fill="#cfe2f5" />
      <path d="M20 10.5l6-2v15l-6 2z" fill="#fff" />
      <path d="M16 5.5a4.6 4.6 0 0 0-4.6 4.6c0 3.4 4.6 8.4 4.6 8.4s4.6-5 4.6-8.4A4.6 4.6 0 0 0 16 5.5z" fill="#f2a900" stroke="#0f6cbd" strokeWidth="1.2" />
      <circle cx="16" cy="10.1" r="1.7" fill="#fff" />
    </svg>
  )
}
