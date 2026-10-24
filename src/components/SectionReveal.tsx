import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
}

export default function SectionReveal({ children, className }: Props) {
  return <div className={className}>{children}</div>
}