import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

const INTERACTIVE = 'a, button, label, summary, [role="button"]'

export default function CursorFollower() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hover, setHover] = useState(false)
  const [down, setDown] = useState(false)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.6 })

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (reduce || !fine.matches) {
      setEnabled(false)
      return
    }
    setEnabled(true)
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = e.target instanceof Element ? e.target : null
      setHover(!!target?.closest(INTERACTIVE))
    }
    const press = () => setDown(true)
    const release = () => setDown(false)
    const hide = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', release)
    document.documentElement.addEventListener('pointerleave', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      document.documentElement.removeEventListener('pointerleave', hide)
    }
  }, [reduce, x, y])

  if (!enabled) return null

  const state = `${hover ? ' is-hover' : ''}${down ? ' is-down' : ''}${visible ? ' is-visible' : ''}`

  return (
    <>
      <motion.div className={`cursor-ring${state}`} style={{ x: ringX, y: ringY }} aria-hidden="true" />
      <motion.div className={`cursor-dot${state}`} style={{ x, y }} aria-hidden="true" />
    </>
  )
}