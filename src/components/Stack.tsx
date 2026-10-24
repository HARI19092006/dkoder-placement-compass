import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { scrollToElement } from '../smoothScroll'

const StackOn = createContext(false)
const Covered = createContext(false)

export const useCovered = () => useContext(Covered)

const WIDE = '(min-width: 768px)'

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches)
  useEffect(() => {
    const mq = window.matchMedia(WIDE)
    const update = () => setWide(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return wide
}

export function Stack({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const on = useWide() && !reduce
  return (
    <StackOn.Provider value={on}>
      <div className={on ? 'stack is-on' : 'stack'}>{children}</div>
    </StackOn.Provider>
  )
}

interface PanelProps {
  children: ReactNode
  index: number
  last?: boolean
  className?: string
}

export function StackPanel({ children, index, last = false, className }: PanelProps) {
  const on = useContext(StackOn)
  const reduce = useReducedMotion()
  const active = on && !last
  const reveal = index > 0 && !reduce
  const panel = useRef<HTMLDivElement>(null)
  const mark = useRef<HTMLDivElement>(null)
  const coveredRef = useRef(false)
  const leavingRef = useRef(false)
  const [covered, setCovered] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [away, setAway] = useState(false)
  const [tall, setTall] = useState(false)
  const inner = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({ target: mark, offset: ['start end', 'start start'] })
  const scale = useTransform(scrollYProgress, [0.15, 0.85], [1, 0.88])
  const opacity = useTransform(scrollYProgress, [0.15, 0.85], [1, 0.45])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const el = panel.current
    if (!el || !active) return
    const wc = v > 0.02 ? 'transform, opacity' : ''
    const box = inner.current
    if (box) {
      const t = Math.min(1, Math.max(0, (v - 0.15) / 0.7))
      box.style.transform = t > 0 ? `scale(${1 - 0.12 * t})` : ''
      if (box.style.willChange !== wc) box.style.willChange = wc
    } else if (el.style.willChange !== wc) el.style.willChange = wc
    const exiting = v > 0.35
    if (exiting !== leavingRef.current) {
      leavingRef.current = exiting
      setLeaving(exiting)
    }
    const next = mark.current?.nextElementSibling
    const now = v >= 1 && next instanceof HTMLElement && next.offsetHeight >= window.innerHeight - 1
    if (now !== coveredRef.current) {
      coveredRef.current = now
      setCovered(now)
    }
  })

  useEffect(() => {
    const el = panel.current
    if (!el) return
    if (!active) {
      el.style.top = ''
      el.style.transformOrigin = ''
      el.style.willChange = ''
      if (inner.current) {
        inner.current.style.transform = ''
        inner.current.style.opacity = ''
        inner.current.style.willChange = ''
        inner.current = null
      }
      setTall(false)
      coveredRef.current = false
      leavingRef.current = false
      setCovered(false)
      setLeaving(false)
      return
    }
    const fit = () => {
      const h = el.offsetHeight
      const vh = window.innerHeight
      el.style.top = `${Math.min(0, vh - h)}px`
      el.style.transformOrigin = `50% ${Math.max(0, h - vh)}px`
      const sticky = h > vh * 1.6 ? el.querySelector<HTMLElement>('.how-sticky') : null
      if (sticky !== inner.current) {
        if (inner.current) {
          inner.current.style.transform = ''
          inner.current.style.opacity = ''
          inner.current.style.willChange = ''
        }
        if (sticky) sticky.style.transformOrigin = '50% 0'
        inner.current = sticky
      }
      setTall(!!sticky)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    window.addEventListener('resize', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [active])

  useEffect(() => {
    const el = panel.current
    if (!el || !reveal || revealed) return
    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setRevealed(true)
        io.disconnect()
      },
      { rootMargin: '0px 0px -22% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reveal, revealed])

  useEffect(() => {
    const el = panel.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setAway(!e.isIntersecting), { rootMargin: '30% 0px 30% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = panel.current
    if (!el || !on) return
    const onFocus = (e: FocusEvent) => {
      if (!coveredRef.current || !(e.target instanceof Element)) return
      scrollToElement(e.target, 'center')
    }
    el.addEventListener('focusin', onFocus)
    return () => el.removeEventListener('focusin', onFocus)
  }, [on])

  const cls = `panel${last ? ' panel-last' : ''}${covered ? ' is-covered' : ''}${leaving ? ' is-leaving' : ''}${reveal ? ' will-reveal' : ''}${revealed ? ' is-revealed' : ''}${away ? ' is-away' : ''}${className ? ` ${className}` : ''}`

  return (
    <Covered.Provider value={covered || leaving}>
      <motion.div ref={panel} className={cls} style={active && !tall ? { zIndex: index + 1, scale, opacity } : { zIndex: index + 1 }}>
        <div className="panel-body">{children}</div>
      </motion.div>
      <div ref={mark} className="panel-mark" aria-hidden="true" />
    </Covered.Provider>
  )
}