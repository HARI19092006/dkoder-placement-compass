import { COMPASS, NODE_ANGLE, nodePosition, project } from '../compass'
import { DESTINATIONS, type Destination } from '../data'

interface Props {
  active: Destination
  variant?: 'stage' | 'mini'
  className?: string
}

/*
  A flat SVG version of the compass. Used as the static fallback when WebGL is
  unavailable (and while the 3D scene loads), and as a small direction marker
  on the mission card.
*/
export default function CompassDial({ active, variant = 'stage', className }: Props) {
  if (variant === 'mini') {
    const toXY = (a: number, r: number) => [20 + Math.cos(a) * r, 20 - Math.sin(a) * r]
    const deg = 90 - (NODE_ANGLE[active] * 180) / Math.PI
    return (
      <svg className={className} viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="#3B0F8C" stroke="#1E0B3F" strokeWidth="2" />
        {DESTINATIONS.map((d) => {
          const [x, y] = toXY(NODE_ANGLE[d.id], 12)
          return <circle key={d.id} cx={x} cy={y} r={d.id === active ? 3.4 : 2.2} fill={d.id === active ? '#FFC800' : '#B79BFF'} />
        })}
        <g className="mini-needle" style={{ transform: `rotate(${deg}deg)` }}>
          <path d="M20 9 L22.6 20 L20 22 L17.4 20 Z" fill="#FFC800" />
          <path d="M20 31 L22 20 L18 20 Z" fill="#B79BFF" opacity=".8" />
        </g>
        <circle cx="20" cy="20" r="2.2" fill="#FFF4CC" />
      </svg>
    )
  }

  const R = COMPASS.discRadius
  const top = project(0, R)
  const bottom = project(0, -R)
  const side = project(R, 0)
  const cx = 50
  const cy = (top.top + bottom.top) / 2
  const rx = side.left - 50
  const ry = (bottom.top - top.top) / 2
  const centre = project(0, 0)
  const dots = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2
    return project(Math.cos(a) * COMPASS.nodeRadius, Math.sin(a) * COMPASS.nodeRadius)
  })
  const tip = nodePosition(active, 1.24)
  const tail = nodePosition(active, -0.72)
  const a = NODE_ANGLE[active]
  const wing = (s: number) => project(Math.cos(a + (s * Math.PI) / 2) * 0.17, Math.sin(a + (s * Math.PI) / 2) * 0.17)
  const l = wing(1)
  const r = wing(-1)

  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx={cx} cy={cy + 1.2} rx={rx} ry={ry} fill="#1E0B3F" opacity=".25" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#3B0F8C" stroke="#6D28D9" strokeWidth="1.4" />
      {dots.map((p, i) => <circle key={i} cx={p.left} cy={p.top} r=".45" fill="#B79BFF" />)}
      {DESTINATIONS.map((d) => {
        const p = nodePosition(d.id)
        const on = d.id === active
        return (
          <g key={d.id}>
            <line x1={centre.left} y1={centre.top} x2={p.left} y2={p.top} stroke={on ? '#FFC800' : '#8B5CF6'} strokeWidth={on ? 1.4 : 0.7} />
            {on && <circle cx={p.left} cy={p.top} r="5.4" fill="none" stroke="#FFC800" strokeWidth=".7" />}
            <circle cx={p.left} cy={p.top} r={on ? 3.6 : 2.6} fill={on ? '#FFC800' : '#A78BFA'} />
          </g>
        )
      })}
      <path d={`M${tip.left} ${tip.top} L${l.left} ${l.top} L${tail.left} ${tail.top} L${r.left} ${r.top} Z`} fill="#FFC800" stroke="#1E0B3F" strokeWidth=".4" />
      <circle cx={centre.left} cy={centre.top} r="2.4" fill="#FFF4CC" />
    </svg>
  )
}
