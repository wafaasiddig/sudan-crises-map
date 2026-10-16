import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

// StrictMode is left out on purpose: its double mount would create and tear down the MapView twice.
createRoot(document.getElementById('root')).render(<App />)
