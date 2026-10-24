import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'

interface Props {
  id?: string
  text: string
  className?: string
}

function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total
  const end = Math.min(1, start + 1.5 / total)
  const opacity = useTransform(progress, [start, end], [0.18, 1])
  return (
    <>
      <motion.span className="hl-word" style={{ opacity }}>
        {word}
      </motion.span>{' '}
    </>
  )
}

export default function ScrollHighlight({ id, text, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'start 38%'] })
  const words = text.split(' ')

  if (reduce) {
    return (
      <h2 id={id} ref={ref} className={className}>
        {text}
      </h2>
    )
  }

  return (
    <h2 id={id} ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word key={`${w}-${i}`} word={w} index={i} total={words.length} progress={scrollYProgress} />
        ))}
      </span>
    </h2>
  )
}