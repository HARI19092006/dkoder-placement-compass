import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'
import { DESTINATIONS, destinationFor, label, type Destination, type Focus } from '../data'
import { focusCheckin } from '../focusCheckin'
import type { Demo } from '../useDemo'
import SectionReveal from './SectionReveal'

const W = 100
const H = 86
const CENTER = { x: 50, y: 52 }

const SPOT: Record<Destination, { x: number; y: number }> = {
  practise: { x: 50, y: 13 },
  explore: { x: 15, y: 72 },
  interview: { x: 85, y: 72 },
}

const EDGES: [Destination, Destination][] = [
  ['explore', 'practise'],
  ['practise', 'interview'],
  ['interview', 'explore'],
]

const ICONS: Record<Destination, string[]> = {
  explore: ['M7 17 17 7', 'M8.5 6.5a2 2 0 1 1 0 .01', 'M15.5 15.5a2 2 0 1 1 0 .01'],
  practise: ['M8.5 7 3.5 12l5 5', 'M15.5 7l5 5-5 5', 'M13.5 4.5l-3 15'],
  interview: ['M4 5h16v11H10l-5 4v-4H4z', 'M8 10.5h8', 'M8 13.5h5'],
}

function curve(a: Destination, b: Destination) {
  const p = SPOT[a]
  const q = SPOT[b]
  const mx = (p.x + q.x) / 2
  const my = (p.y + q.y) / 2
  const cx = mx + (mx - CENTER.x) * 0.55
  const cy = my + (my - CENTER.y) * 0.55
  return `M${p.x} ${p.y} Q${cx} ${cy} ${q.x} ${q.y}`
}

function Icon({ id, draw }: { id: Destination; draw: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="orb-icon" aria-hidden="true">
      {ICONS[id].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          initial={false}
          animate={{ pathLength: draw ? [0, 1] : 1 }}
          transition={{ duration: 0.7, delay: draw ? 0.1 + i * 0.12 : 0, ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
    </svg>
  )
}

function ProgressRing({ value }: { value: number }) {
  return (
    <svg viewBox="0 0 44 44" className="dd-ring" aria-hidden="true">
      <circle cx="22" cy="22" r="18" className="dd-ring-track" />
      <motion.circle
        cx="22"
        cy="22"
        r="18"
        className="dd-ring-fill"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.max(0.001, value) }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

const card: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.07, delayChildren: 0.05 } },
  exit: { opacity: 0, y: -16, scale: 0.98, transition: { duration: 0.2 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export default function Journey({ demo }: { demo: Demo }) {
  const reduce = useReducedMotion()
  const [picked, setPicked] = useState<Destination>(() => destinationFor(demo.sel.focus).id)
  const d = DESTINATIONS.find((x) => x.id === picked) ?? DESTINATIONS[0]
  const done = demo.doneFor(d.focus)

  const start = (focus: Focus) => {
    demo.setChoice('focus', focus)
    focusCheckin(demo.sel.mood ? 'time' : 'mood', true)
  }

  return (
    <section id="journey" className="journey" aria-labelledby="journey-title">
      <div className="wrap">
        <SectionReveal className="sec-head">
          <h2 id="journey-title">Three destinations, no fixed order.</h2>
          <p className="lead">
            Every place connects to every other. Start where today makes sense, go back, or stay in one place for a
            week. Choose a destination to see what practising there looks like.
          </p>
        </SectionReveal>

        <div className="journey-grid">
          <div className="map">
            <svg className="map-lines" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              <defs>
                <radialGradient id="map-core">
                  <stop offset="0%" stopColor="#FFC800" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#FFC800" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={CENTER.x} cy={CENTER.y} r="16" fill="url(#map-core)" />
              <circle cx={CENTER.x} cy={CENTER.y} r="11" className="map-orbit" />
              {EDGES.map(([a, b]) => {
                const path = curve(a, b)
                const on = a === picked || b === picked
                const towardStart = a === picked
                return (
                  <g key={a + b}>
                    <path d={path} className={on ? 'map-edge on' : 'map-edge'} />
                    {on && !reduce && (
                      <circle r="1.3" className="map-comet">
                        <animateMotion
                          dur="2.4s"
                          repeatCount="indefinite"
                          path={path}
                          keyPoints={towardStart ? '1;0' : '0;1'}
                          keyTimes="0;1"
                          calcMode="linear"
                        />
                      </circle>
                    )}
                  </g>
                )
              })}
            </svg>
            <p className="map-centre" aria-hidden="true">Start anywhere</p>
            <div role="group" aria-label="Destinations">
              {DESTINATIONS.map((x, i) => {
                const on = x.id === picked
                return (
                  <button
                    key={x.id}
                    type="button"
                    className={on ? 'stop is-on' : 'stop'}
                    style={{ left: `${(SPOT[x.id].x / W) * 100}%`, top: `${(SPOT[x.id].y / H) * 100}%`, animationDelay: `${i * -1.4}s` }}
                    aria-pressed={on}
                    onClick={() => setPicked(x.id)}
                  >
                    <motion.span className="orb" animate={{ scale: on ? 1.14 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                      {on && <span className="orb-ring" aria-hidden="true" />}
                      {on && <span className="orb-ring late" aria-hidden="true" />}
                      <Icon id={x.id} draw={on} />
                    </motion.span>
                    <span className="stop-name">{x.name}</span>
                    <span className="stop-cap">{x.caption}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="dest-detail" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={d.id} variants={card} initial="hidden" animate="show" exit="exit">
                <motion.div className="dd-head" variants={item}>
                  <span className="dd-icon">
                    <Icon id={d.id} draw />
                  </span>
                  <div className="dd-title">
                    <span className="dd-kicker">{label.focus(d.focus)}</span>
                    <h3>{d.name}: {d.caption.toLowerCase()}</h3>
                  </div>
                  <span className="dd-progress">
                    <ProgressRing value={done / 9} />
                    <b>{done}/9</b>
                  </span>
                </motion.div>
                <motion.p className="dd-goal" variants={item}>{d.goal}</motion.p>
                <dl>
                  <motion.div variants={item}><dt>Example mission</dt><dd>{d.example}</dd></motion.div>
                  <motion.div variants={item}><dt>When it helps</dt><dd>{d.whenUseful}</dd></motion.div>
                  <motion.div variants={item}><dt>Your demo progress here</dt><dd>{done} of 9 sample {label.focus(d.focus).toLowerCase()} missions done</dd></motion.div>
                </dl>
                <motion.div variants={item}>
                  <button type="button" className="btn" onClick={() => start(d.focus)}>
                    Practise {label.focus(d.focus).toLowerCase()}
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <p className="note">Destinations and examples are illustrative. They are not levels, and nobody has to visit all three.</p>
      </div>
    </section>
  )
}