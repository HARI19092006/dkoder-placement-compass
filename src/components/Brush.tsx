import { useRef, type ReactNode } from 'react'
import { useInView } from 'motion/react'

interface Props {
  children: ReactNode
  draw?: boolean
  className?: string
}

export default function Brush({ children, draw = true, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const on = inView && draw
  return (
    <span ref={ref} className={`brush${on ? ' is-drawn' : ''}${className ? ` ${className}` : ''}`}>
      <span className="brush-text">{children}</span>
      <svg className="brush-stroke" viewBox="0 0 400 44" preserveAspectRatio="none" aria-hidden="true">
        <path d="M14 30C8 26 12 21 22 20C94 14 190 10 282 11C330 11 366 13 392 17C397 18 397 22 392 23C352 22 300 22 246 23C170 25 96 29 36 36C24 37 18 34 14 30Z" />
        <path className="brush-dry" d="M40 34C110 28 196 25 286 25C326 25 356 26 380 28C356 30 322 30 286 30C206 31 126 34 58 39C46 40 36 37 40 34Z" />
      </svg>
    </span>
  )
}