import { Sparkle } from './icons'

const SPARKS = [
  { x: 6, y: 30, s: 16, d: 0 },
  { x: 49, y: 36, s: 22, d: 1.1 },
  { x: 54, y: 90, s: 14, d: 2.2 },
  { x: 86, y: 18, s: 18, d: 0.6 },
  { x: 95, y: 54, s: 14, d: 1.7 },
  { x: 72, y: 8, s: 12, d: 2.8 },
]

export default function HeroBackdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <span className="atmos" />
      <span className="sphere sphere-tl" />
      <span className="sphere sphere-bl" />
      <span className="sphere sphere-br" />
      <span className="sphere sphere-sm sm-1" />
      <span className="sphere sphere-sm sm-2" />
      <span className="sphere sphere-sm sm-3" />
      <span className="orbit-arc arc-1" />
      <span className="orbit-arc arc-2" />
      <span className="shoot shoot-1" />
      <span className="shoot shoot-2" />
      {SPARKS.map((p, i) => (
        <Sparkle
          key={i}
          className="spark"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, animationDelay: `${p.d}s` }}
        />
      ))}
    </div>
  )
}