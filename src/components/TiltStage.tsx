import { useRef, type PointerEvent, type ReactNode } from 'react'
import { motion, useReducedMotion, useSpring } from 'motion/react'

const spring = { stiffness: 140, damping: 18, mass: 0.6 }

export default function TiltStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const rotateX = useSpring(0, spring)
  const rotateY = useSpring(0, spring)

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    rotateY.set(px * 14)
    rotateX.set(py * -10)
  }

  const leave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div ref={ref} className="tilt-stage" onPointerMove={move} onPointerLeave={leave}>
      <motion.div className="tilt-inner" style={{ rotateX, rotateY }}>
        {children}
      </motion.div>
    </div>
  )
}