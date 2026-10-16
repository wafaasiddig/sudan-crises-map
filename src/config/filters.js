// Approximate centre / zoom per country for the "Select a country" filter.
export const COUNTRIES = [
  { name: 'All countries', center: null },
  { name: 'Sudan', center: [30.2, 15.6], zoom: 5 },
  { name: 'Chad', center: [18.7, 15.4], zoom: 5 },
  { name: 'South Sudan', center: [30.3, 7.6], zoom: 6 },
  { name: 'Central African Republic', center: [20.9, 6.6], zoom: 6 },
  { name: 'Ethiopia', center: [39.6, 9.1], zoom: 5 },
  { name: 'Egypt', center: [30.8, 26.8], zoom: 5 },
  { name: 'Libya', center: [17.2, 26.3], zoom: 5 },
  { name: 'Uganda', center: [32.3, 1.4], zoom: 6 },
]

export const SCOPES = [
  { id: 'extent', label: 'Map view' },
  { id: 'region', label: 'Whole region' },
]
