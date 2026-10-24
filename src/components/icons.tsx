import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function ArrowRight(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

export function PlayCircle(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M10 8.6v6.8l5.6-3.4z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CompassMark(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M15.6 8.4l-2 5.2-5.2 2 2-5.2z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Refresh(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" />
      <path d="M20 20v-4h-4" />
    </svg>
  )
}

export function Target(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 12l6.5-6.5" />
      <path d="M16 5.5h2.5V8" />
    </svg>
  )
}

export function Bolt(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M13.5 2.5 5 13.5h6l-1 8 8.5-11h-6z" fill="currentColor" />
    </svg>
  )
}

export function Person(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="8" r="4" fill="currentColor" stroke="none" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CodeIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M8.5 7 3.5 12l5 5" />
      <path d="M15.5 7l5 5-5 5" />
      <path d="M13.5 4.5l-3 15" />
    </svg>
  )
}

export function ChartIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M6 20V11" />
      <path d="M12 20V5" />
      <path d="M18 20v-6" />
    </svg>
  )
}

export function ChatIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" />
      <path d="M8 9h8" />
      <path d="M8 12h5" />
    </svg>
  )
}

export function Sparkle(p: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z" fill="currentColor" />
    </svg>
  )
}

export function ColorCode(p: P) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...p}>
      <rect x="2" y="4" width="28" height="24" rx="7" fill="var(--ico-bg, #EFE7FF)" />
      <path d="M12 11l-5 5 5 5M20 11l5 5-5 5M17.5 9.5l-3 13" fill="none" stroke="var(--ico, #6D28D9)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ColorChart(p: P) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...p}>
      <rect x="3" y="4" width="26" height="24" rx="5" fill="var(--ico-bg, #F4F0FF)" />
      <rect x="8" y="15" width="4" height="9" rx="1.2" fill="var(--ico-a, #8B5CF6)" />
      <rect x="14" y="9" width="4" height="15" rx="1.2" fill="var(--ico-b, #4F7BFF)" />
      <rect x="20" y="12" width="4" height="12" rx="1.2" fill="var(--ico-c, #FF5A7A)" />
    </svg>
  )
}

export function ColorChat(p: P) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...p}>
      <path d="M5 8.5A3.5 3.5 0 0 1 8.5 5h15A3.5 3.5 0 0 1 27 8.5v10a3.5 3.5 0 0 1-3.5 3.5H14l-6 5v-5.2A3.5 3.5 0 0 1 5 18.5z" fill="var(--ico, #FFC800)" />
      <path d="M10.5 11.5h11M10.5 15.5h7" stroke="var(--ico-line, #B86B00)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export function Clock({ minutes, ...p }: P & { minutes: number }) {
  const a = (minutes / 60) * Math.PI * 2 - Math.PI / 2
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...p}>
      <circle cx="16" cy="16" r="12.5" fill="var(--ico-bg, #FFFFFF)" stroke="var(--ico, #1A0846)" strokeWidth="2.2" />
      {[0, 1, 2, 3].map((i) => {
        const t = (i / 4) * Math.PI * 2
        return <circle key={i} cx={16 + Math.cos(t) * 9.6} cy={16 + Math.sin(t) * 9.6} r="1" fill="var(--ico, #1A0846)" />
      })}
      <path d={`M16 16L16 9.5`} stroke="var(--ico, #1A0846)" strokeWidth="2.2" strokeLinecap="round" />
      <path d={`M16 16L${(16 + Math.cos(a) * 8).toFixed(2)} ${(16 + Math.sin(a) * 8).toFixed(2)}`} stroke="var(--ico-hand, #6D28D9)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="1.8" fill="var(--ico, #1A0846)" />
    </svg>
  )
}