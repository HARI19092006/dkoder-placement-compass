import { useRef, type PointerEvent, type ReactNode } from 'react'
import { motion, useReducedMotion, useSpring } from 'motion/react'

interface Props {
  children: ReactNode
  strength?: number
}

const spring = { stiffness: 260, damping: 18, mass: 0.4 }

export default function Magnetic({ children, strength = 0.28 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  const leave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span ref={ref} className="magnetic" style={{ x, y }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </motion.span>
  )
}