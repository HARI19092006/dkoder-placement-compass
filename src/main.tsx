import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Enables scroll-reveal styles and applies the saved theme (light by default).
const root = document.documentElement
root.classList.add('js')
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