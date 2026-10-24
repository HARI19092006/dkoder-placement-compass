import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './theme.css'
import './wallpaper.css'
import './reveal.css'

// Apply the saved theme before first paint (light by default).
const root = document.documentElement
try {
  const t = localStorage.getItem('dkoder-theme')
  root.dataset.theme = t === 'dark' ? 'dark' : 'light'
} catch {
  root.dataset.theme = 'light'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)