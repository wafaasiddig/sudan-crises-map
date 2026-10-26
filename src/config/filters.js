// Approximate centre / zoom per country for the country filter.
// `code` is the ISO 3166-1 alpha-2 code used to load the flag image;
// `short` is an optional label for names too long to fit under the flag.
export const ALL_COUNTRIES = { name: 'All countries', center: null }

export const COUNTRIES = [
  { name: 'Sudan', code: 'sd', center: [30.2, 15.6], zoom: 5 },
  { name: 'Chad', code: 'td', center: [18.7, 15.4], zoom: 5 },
  { name: 'South Sudan', code: 'ss', center: [30.3, 7.6], zoom: 6 },
  { name: 'Central African Republic', code: 'cf', short: 'CAR', center: [20.9, 6.6], zoom: 6 },
  { name: 'Ethiopia', code: 'et', center: [39.6, 9.1], zoom: 5 },
  { name: 'Egypt', code: 'eg', center: [30.8, 26.8], zoom: 5 },
  { name: 'Libya', code: 'ly', center: [17.2, 26.3], zoom: 5 },
  { name: 'Uganda', code: 'ug', center: [32.3, 1.4], zoom: 6 },
]

// Country selected when the page loads (must match a `name` above).
export const DEFAULT_COUNTRY = 'Sudan'

export const flagUrl = (code) => `https://flagcdn.com/w80/${code}.png`

// Security date filter. Periods count back from the latest event in the data (the ACLED feed lags behind today).
// `days: null` keeps the full rolling year the layer holds.
export const PERIODS = [
  { id: 'week', label: 'Past week', days: 7 },
  { id: 'month', label: 'Past month', days: 30 },
  { id: 'year', label: 'Past year', days: null },
]
export const DEFAULT_PERIOD = 'year'

export const SCOPES = [
  { id: 'extent', label: 'Map view' },
  { id: 'selection', label: 'Selected Admin' },
]
