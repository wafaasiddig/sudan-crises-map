export const fmt = (n) => (n == null || Number.isNaN(n) ? '–' : Math.round(n).toLocaleString('en-US'))
export const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '–')
export const sum = (rows, k) => rows.reduce((s, r) => s + (r[k] || 0), 0)
