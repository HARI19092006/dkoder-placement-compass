import { motion } from 'motion/react'
import { destinationFor, label, type Focus } from '../data'
import { focusCheckin } from '../focusCheckin'
import Brush from './Brush'
import CompassStage from './CompassStage'
import HeroBackdrop from './HeroBackdrop'
import Magnetic from './Magnetic'
import TiltStage from './TiltStage'
import { ArrowRight, Bolt, CompassMark, Person, PlayCircle, Target } from './icons'

const ease = [0.2, 0.7, 0.2, 1] as const

const FACTS = [
  { n: '27', t: 'sample missions', icon: <Target />, tone: 'y' },
  { n: '5–25', t: 'minute tasks', icon: <Bolt />, tone: 'v' },
  { n: '0', t: 'sign-ups needed', icon: <Person />, tone: 'w' },
]

interface Props {
  focus: Focus
  onPickFocus: (focus: Focus) => void
  ready: boolean
}

export default function HeroSection({ focus, onPickFocus, ready }: Props) {
  const dest = destinationFor(focus)
  const lines = [
    'Placement prep,',
    <Brush key="b" draw={ready}>one doable step</Brush>,
    'at a time.',
  ]

  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroBackdrop />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.p
            className="hero-badge"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, ease }}
          >
            <span aria-hidden="true">🚀</span> Practise · Explore · Interview
          </motion.p>
          <h1 id="hero-title">
            {lines.map((l, i) => (
              <span key={i} className="ln-mask">
                <motion.span
                  className="ln"
                  initial={{ y: '110%' }}
                  animate={{ y: ready ? '0%' : '110%' }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
          >
            <p className="lead">
              When placement preparation feels like too much, Dkoder helps you find one realistic next step. Say how today
              feels, what you want to practise and how long you have.
            </p>
            <div className="ctas">
              <Magnetic>
                <a className="btn btn-hero" href="#checkin" onClick={() => focusCheckin('mood')}>
                  <CompassMark className="btn-lead" />
                  Check in now
                  <ArrowRight className="btn-arrow" />
                </a>
              </Magnetic>
              <a className="btn ghost btn-play" href="#how">
                <PlayCircle className="btn-lead" />
                See how it works
              </a>
            </div>
            <ul className="hero-facts">
              {FACTS.map((f) => (
                <li key={f.t}>
                  <span className={`fact-icon tone-${f.tone}`} aria-hidden="true">{f.icon}</span>
                  <span className="fact-text"><b>{f.n}</b> {f.t}</span>
                </li>
              ))}
            </ul>
            <p className="fine">A frontend demo with sample missions. No login, no AI, nothing leaves your browser.</p>
          </motion.div>
        </div>

        <div className="hero-compass-wrap">
          <motion.figure
            className="hero-compass"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            <TiltStage>
              <CompassStage active={dest.id} onPick={onPickFocus} />
            </TiltStage>
            <figcaption aria-live="polite">
              Your focus is {label.focus(focus).toLowerCase()}, so the needle points to <b>{dest.name}</b>. Pick a
              destination to change it.
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  )
}