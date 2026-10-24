import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion, useScroll } from 'motion/react'
import { hasWebGL, nodePosition } from '../compass'
import { DESTINATIONS, type Destination, type Focus } from '../data'
import CompassDial from './CompassDial'
import { ArrowRight, ChartIcon, ChatIcon, CodeIcon } from './icons'
import { useCovered } from './Stack'

const PlacementCompassScene = lazy(() => import('./PlacementCompassScene'))

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, inView }
}

const LABEL_PLACEMENT: Record<Destination, string> = {
  practise: 'above',
  explore: 'left',
  interview: 'right',
}

const LABEL_RADIUS: Record<Destination, number> = {
  practise: 2.3,
  explore: 2.15,
  interview: 2.15,
}

const LABEL_ICON: Record<Destination, ReactNode> = {
  practise: <CodeIcon />,
  explore: <ChartIcon />,
  interview: <ChatIcon />,
}

interface Props {
  active: Destination
  onPick: (focus: Focus) => void
}

export default function CompassStage({ active, onPick }: Props) {
  const reduce = useReducedMotion() ?? false
  const covered = useCovered()
  const { ref, inView } = useInView<HTMLDivElement>()
  const [webgl] = useState(hasWebGL)
  const [lite] = useState(() => window.matchMedia?.('(max-width: 640px)').matches ?? false)
  const { scrollY } = useScroll()
  const fallback = <CompassDial active={active} className="compass-fallback" />

  return (
    <div className="compass" ref={ref}>
      <div className="compass-view">
        <span className="compass-halo" aria-hidden="true" />
        {webgl ? (
          <SceneBoundary fallback={fallback}>
            <Suspense fallback={fallback}>
              <PlacementCompassScene
                active={active}
                animate={inView && !covered && !reduce}
                lite={lite}
                scroll={reduce ? undefined : scrollY}
              />
            </Suspense>
          </SceneBoundary>
        ) : (
          fallback
        )}
        <div className="compass-labels" role="group" aria-label="Compass destinations">
          {DESTINATIONS.map((d) => {
            const p = nodePosition(d.id, LABEL_RADIUS[d.id])
            return (
              <button
                key={d.id}
                type="button"
                className={`dest dest-${LABEL_PLACEMENT[d.id]}`}
                style={{ left: `${p.left}%`, top: `${p.top}%` }}
                aria-pressed={d.id === active}
                onClick={() => onPick(d.focus)}
              >
                <span className="dest-icon" aria-hidden="true">{LABEL_ICON[d.id]}</span>
                <span className="dest-text">
                  <b>{d.name}</b>
                  <span>{d.caption}</span>
                </span>
                <ArrowRight className="dest-arrow" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}