import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { JOURNEY_STEPS } from '../data'
import { focusCheckin } from '../focusCheckin'
import { docTop, scrollToY } from '../smoothScroll'
import Brush from './Brush'
import Magnetic from './Magnetic'
import ScrollHighlight from './ScrollHighlight'
import SectionReveal from './SectionReveal'

const HOW_LEAD = 'Six small moves. Most days you’ll go round once, and stopping after any of them is fine.'
const HOW_BACK = 'Then back to step 1, whenever you next have a few minutes.'

function useWideScreen() {
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 900px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const update = () => setWide(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return wide
}

function LoopList() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 60%'] })
  const [lit, setLit] = useState(0)
  const total = JOURNEY_STEPS.length

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setLit(v <= 0 ? 0 : Math.min(total, Math.ceil(v * total)))
  })

  return (
    <section id="how" className="how" aria-labelledby="how-title">
      <div className="wrap">
        <SectionReveal className="sec-head">
          <h2 id="how-title">A loop you can leave at <Brush>any point.</Brush></h2>
          <p className="lead">{HOW_LEAD}</p>
        </SectionReveal>
        <div className="loop-wrap">
          <motion.span className="loop-rail" aria-hidden="true" style={{ scaleX: scrollYProgress }} />
          <ol ref={ref} className="loop">
            {JOURNEY_STEPS.map((s, i) => (
              <li key={s.title} className={i < lit ? 'is-lit' : undefined}>
                <span className="loop-n" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="loop-back">{HOW_BACK}</p>
      </div>
    </section>
  )
}

const DIAL_R = 88
const NODE_R = 44
const STEP_ICONS: string[][] = [
  ['M3 12h4l2-5 4 10 2-5h6'],
  ['M12 7a5 5 0 1 1 0 10a5 5 0 1 1 0-10', 'M12 2v3M12 19v3M2 12h3M19 12h3'],
  ['M6 21V4h11l-2.5 4L17 12H6'],
  ['M8.5 7 3.5 12l5 5', 'M15.5 7l5 5-5 5'],
  ['M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18', 'M8 12.5l3 3 5-6'],
  ['M4.5 12a7.5 7.5 0 0 1 13-5.1', 'M18 3.5v4h-4', 'M19.5 12a7.5 7.5 0 0 1-13 5.1', 'M6 20.5v-4h4'],
]
const nodeAt = (i: number, total: number) => {
  const a = (i / total) * Math.PI * 2 - Math.PI / 2
  return { left: 50 + Math.cos(a) * NODE_R, top: 50 + Math.sin(a) * NODE_R }
}

function LoopStory() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const total = JOURNEY_STEPS.length
  const [active, setActive] = useState(0)
  const dialRotate = useTransform(scrollYProgress, [0, 1], [0, -300])
  const travelerLeft = useTransform(scrollYProgress, (v) => `${50 + Math.cos(v * Math.PI * 2 - Math.PI / 2) * NODE_R}%`)
  const travelerTop = useTransform(scrollYProgress, (v) => `${50 + Math.sin(v * Math.PI * 2 - Math.PI / 2) * NODE_R}%`)
  const returnOpacity = useTransform(scrollYProgress, [0.86, 0.97], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.max(0, Math.min(total - 1, Math.floor(v * total))))
  })

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const span = el.offsetHeight - window.innerHeight
    scrollToY(docTop(el) + (span * (i + 0.5)) / total)
  }

  const step = JOURNEY_STEPS[active]

  return (
    <section id="how" ref={ref} className="how how-story" style={{ height: `${total * 75 + 40}vh` }} aria-labelledby="how-title">
      <div className="how-sticky">
        <div className="wrap how-stage">
          <div className="how-left">
            <h2 id="how-title">A loop you can leave at <Brush>any point.</Brush></h2>
            <p className="lead">{HOW_LEAD}</p>
            <ol className="how-index">
              {JOURNEY_STEPS.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    className={i === active ? 'is-on' : i < active ? 'is-past' : undefined}
                    aria-current={i === active ? 'step' : undefined}
                    onClick={() => jump(i)}
                  >
                    {i === active && <motion.span layoutId="how-hl" className="how-hl" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                    <span className="how-i">{i + 1}</span>
                    <span className="how-t">{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="loop-back">{HOW_BACK}</p>
          </div>

          <div className="how-right" aria-live="polite">
            <div className="how-dial">
              <motion.svg viewBox="0 0 200 200" className="how-ring" style={{ rotate: dialRotate }} aria-hidden="true">
                <circle cx="100" cy="100" r="98" className="how-track" />
              </motion.svg>
              <svg viewBox="0 0 200 200" className="how-progress" aria-hidden="true">
                <defs>
                  <linearGradient id="how-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="60%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#FFC800" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r={DIAL_R} className="how-base" />
                <motion.circle cx="100" cy="100" r={DIAL_R} className="how-fill" stroke="url(#how-grad)" style={{ pathLength: scrollYProgress }} />
              </svg>
              <motion.span className="how-traveler" style={{ left: travelerLeft, top: travelerTop }} aria-hidden="true" />
              {JOURNEY_STEPS.map((s, i) => {
                const p = nodeAt(i, total)
                return (
                  <button
                    key={s.title}
                    type="button"
                    className={`how-node${i === active ? ' is-on' : i < active ? ' is-past' : ''}`}
                    style={{ left: `${p.left}%`, top: `${p.top}%` }}
                    onClick={() => jump(i)}
                    aria-label={`Go to step ${i + 1}: ${s.title}`}
                  >
                    {i + 1}
                  </button>
                )
              })}
              <motion.span className="how-return" style={{ opacity: returnOpacity }} aria-hidden="true">
                Back to 1
              </motion.span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  className="how-card"
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <svg viewBox="0 0 24 24" className="how-icon" aria-hidden="true">
                    {STEP_ICONS[active].map((d, k) => (
                      <motion.path
                        key={d}
                        d={d}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.15 + k * 0.12, ease: [0.65, 0, 0.35, 1] }}
                      />
                    ))}
                  </svg>
                  <span className="how-num" aria-hidden="true">{String(active + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <span className="how-pips" aria-hidden="true">
                    {JOURNEY_STEPS.map((_, k) => (
                      <i key={k} className={k === active ? 'on' : k < active ? 'past' : undefined} />
                    ))}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HowItWorks() {
  const wide = useWideScreen()
  const reduce = useReducedMotion()
  return wide && !reduce ? <LoopStory /> : <LoopList />
}

const PRINCIPLES = [
  { title: 'Small enough to start tired', text: 'Every sample mission has a finish line you can see from the start. Finishing one counts.' },
  { title: 'Nothing to compare', text: 'No ranks, no countdowns and no streaks to lose. Dkoder never compares you with anyone.' },
  { title: 'Honest about how it works', text: 'Missions are picked by a short rule you can read in the FAQ. Your mood is never stored.' },
]

const SUPPORT = [
  { title: 'Solo practice', text: 'Do your mission alone, at your own hour, with nobody watching.' },
  { title: 'Peer study', text: 'Pick the same mission as a classmate and compare how you each approached it.' },
  { title: 'Mentor guidance', text: 'Bring one finished mission and one question to someone more experienced.' },
]

export function Principles() {
  return (
    <section className="principles" aria-labelledby="pr-title">
      <div className="wrap">
        <div className="sec-head">
          <ScrollHighlight id="pr-title" className="statement" text="Progress that helps you notice, not compare." />
        </div>
        <ul className="pr-list">
          {PRINCIPLES.map((p) => (
            <li key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
        <div className="support">
          <div>
            <h3 className="support-title">Ways a mission could fit your week</h3>
            <p className="support-note">Illustrations only. No mentors or study groups are connected in this demo.</p>
          </div>
          <ul>
            {SUPPORT.map((s) => (
              <li key={s.title}><b>{s.title}.</b> {s.text}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function ClosingCta() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.84, 1])

  return (
    <div className="wrap">
      <motion.div ref={ref} className="close" style={reduce ? undefined : { scale }}>
        <span className="close-orbit one" aria-hidden="true"><i /></span>
        <span className="close-orbit two" aria-hidden="true"><i /></span>
        <SectionReveal>
          <h2>Ready for one small step?</h2>
          <p>Three questions, under a minute. You can stop as soon as the mission is done.</p>
          <Magnetic>
            <a className="btn" href="#checkin" onClick={() => focusCheckin('mood')}>Check in now</a>
          </Magnetic>
        </SectionReveal>
      </motion.div>
    </div>
  )
}