import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { MISSIONS } from '../missions'

const TITLES = MISSIONS.filter((m) => m.level === 2).map((m) => m.title)

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

export default function MissionMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const direction = useRef(-1)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const boost = useTransform(smooth, [-1200, 0, 1200], [-5, 0, 5], { clamp: false })
  const skewX = useTransform(smooth, [-1800, 0, 1800], [10, 0, -10])
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return
    const b = boost.get()
    if (b < 0) direction.current = 1
    else if (b > 0) direction.current = -1
    let step = direction.current * 2.2 * (delta / 1000)
    step += step * Math.abs(b)
    base.set(base.get() + step)
  })

  return (
    <div ref={ref} className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" style={reduce ? undefined : { x, skewX }}>
        {[...TITLES, ...TITLES].map((t, i) => (
          <span key={i} className="marquee-item">
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  )
}