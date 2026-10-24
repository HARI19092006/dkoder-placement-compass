import { useEffect, useRef, useState } from 'react'
import { focusCheckin } from '../focusCheckin'
import { ArrowRight } from './icons'

type Theme = 'light' | 'dark'
const TKEY = 'dkoder-theme'

function savedTheme(): Theme {
  try {
    return localStorage.getItem(TKEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(savedTheme)
  const btn = useRef<HTMLButtonElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      const p = max > 0 ? h.scrollTop / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 821px)')
    const onChange = () => {
      if (mq.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btn.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const dark = theme === 'dark'
  const toggleTheme = () => {
    const next: Theme = dark ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem(TKEY, next)
    } catch {
      return
    }
  }
  const close = () => setOpen(false)

  return (
    <header>
      <div className="wrap">
        <div className="bar">
          <a className="logo" href="#top" aria-label="Dkoder home">
            <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="30" fill="#FFC800" />
              <circle cx="40" cy="25" r="5" fill="#5B21B6" />
              <circle cx="26" cy="38" r="3.6" fill="#5B21B6" />
            </svg>
            Dkoder
          </a>
          <nav id="nav" className={open ? 'open' : ''} aria-label="Main">
            <ul>
              <li><a href="#how" onClick={close}>How it works</a></li>
              <li><a href="#journey" onClick={close}>Destinations</a></li>
              <li><a href="#faq" onClick={close}>FAQ</a></li>
              <li>
                <a className="btn" href="#checkin" onClick={() => { close(); focusCheckin('mood') }}>
                  Check in <ArrowRight className="btn-arrow" />
                </a>
              </li>
            </ul>
          </nav>
          <div className="actions">
            <button type="button" className="icon-btn" onClick={toggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
              {dark ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
            <button ref={btn} type="button" className="menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen((o) => !o)}>
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
          <div className="sp" ref={bar} aria-hidden="true" />
        </div>
      </div>
    </header>
  )
}