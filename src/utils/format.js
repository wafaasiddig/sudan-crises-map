export const fmt = (n) => (n == null || Number.isNaN(n) ? '–' : Math.round(n).toLocaleString('en-US'))
export const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '–')
export const sum = (rows, k) => rows.reduce((s, r) => s + (r[k] || 0), 0)
// Short axis label: 20.0k, 1.2M, or the plain number below 1,000.
export const fmtShort = (n) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : `${Math.round(n)}`
