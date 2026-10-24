import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

export default function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      count.set(value)
      return
    }
    const controls = animate(count, value, { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] })
    return () => controls.stop()
  }, [inView, reduce, value, count])

  return <motion.span ref={ref}>{rounded}</motion.span>
}