import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { destinationFor, FOCUSES, label } from '../data'
import { focusCheckin } from '../focusCheckin'
import { LEVEL_NAME } from '../missions'
import { explain } from '../recommend'
import type { Demo } from '../useDemo'
import CompassDial from './CompassDial'
import CountUp from './CountUp'
import { ArrowRight, Refresh } from './icons'

const wipe = {
  initial: { opacity: 0, y: 22, clipPath: 'inset(100% 0% 0% 0%)' },
  animate: { opacity: 1, y: 0, clipPath: 'inset(-10% -10% -10% -10%)' },
  exit: { opacity: 0, y: -14, clipPath: 'inset(0% 0% 100% 0%)' },
  transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
}

const flip = {
  initial: { opacity: 0, rotateX: -75, y: 30 },
  animate: { opacity: 1, rotateX: 0, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { type: 'spring' as const, stiffness: 210, damping: 20 },
}

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

const changeFocus = () => focusCheckin('focus', true)

function Body({ demo }: { demo: Demo }) {
  const { rec, sel, phase } = demo
  const swap = useReducedMotion() ? fade : wipe

  if (!rec || !sel.mood) {
    return (
      <motion.div className="mc-empty" {...swap}>
        <CompassDial active={destinationFor(sel.focus).id} variant="mini" className="mc-dial" />
        <h3>Your mission will appear here</h3>
        <p>Start with question 1. Choose how you’re feeling and you’ll get one sample mission sized to your time.</p>
        <button type="button" className="btn small" onClick={() => focusCheckin('mood', true)}>
          Go to question 1 <ArrowRight className="btn-arrow" />
        </button>
      </motion.div>
    )
  }

  const m = rec.mission
  const dest = destinationFor(m.focus)

  if (phase === 'stopped') {
    return (
      <motion.div className="mc-rest" {...swap}>
        <h3>That’s enough for today.</h3>
        <p>Stopping is part of the plan. Your demo progress stays in this browser, and there is no streak to protect.</p>
        <button type="button" className="btn small" onClick={demo.resume}>Check in again</button>
      </motion.div>
    )
  }

  if (phase === 'done') {
    return (
      <motion.div className="mc-done" {...(swap === fade ? fade : flip)}>
        <svg className="mc-check" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="21" />
          <motion.path d="M14 25 L21 32 L34 17" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.1 }} />
        </svg>
        <h3>Done. That counts.</h3>
        <p>You finished “{m.title}”.</p>
        <div className="mc-next">
          <b>A useful next step</b>
          <p>{m.next}</p>
        </div>
        <div className="mc-actions">
          <button type="button" className="btn small" onClick={demo.tryAnother}>Choose another mission</button>
          <button type="button" className="btn small ghost" onClick={changeFocus}>Change my focus</button>
          <button type="button" className="link" onClick={demo.stop}>Stop for today</button>
        </div>
      </motion.div>
    )
  }

  const completed = !!demo.done[m.id]
  return (
    <motion.div className="mc-active" {...swap}>
      <div className="mc-meta">
        <CompassDial active={dest.id} variant="mini" className="mc-dial" />
        <div>
          <span className="mc-kicker">{label.focus(m.focus)}, {m.time} min</span>
          <span className="mc-towards">Towards {dest.name}</span>
        </div>
        <span className={`level level-${m.level}`}>{LEVEL_NAME[m.level]}</span>
      </div>
      <h3 id="mission-title">{m.title}</h3>
      <p className="mc-task">{m.task}</p>
      <p className="mc-finish"><b>Done when:</b> {m.doneWhen}</p>
      <p className="mc-why"><b>Why this fits:</b> {explain(rec, { mood: sel.mood, focus: sel.focus, time: sel.time })}</p>
      {completed && <p className="mc-again">You’ve done this one before. Doing it again is fine.</p>}
      <div className="mc-primary">
        <button type="button" className="btn" onClick={demo.complete}>Mark as done</button>
      </div>
      <div className="mc-actions" role="group" aria-label="Other options">
        <button type="button" className="chip-btn" onClick={demo.tryEasier} disabled={!demo.easier}>
          {demo.easier ? 'Make it easier' : 'Already the gentlest'}
        </button>
        <button type="button" className="chip-btn" onClick={demo.tryAnother}>Try another</button>
        <button type="button" className="chip-btn" onClick={changeFocus}>Change my focus</button>
      </div>
    </motion.div>
  )
}

function bodyKey({ rec, sel, phase }: Demo): string {
  if (!rec || !sel.mood) return 'empty'
  if (phase !== 'active') return `${phase}-${rec.mission.id}`
  return `m-${rec.mission.id}-${rec.reason}`
}

export default function MissionCard({ demo }: { demo: Demo }) {
  return (
    <div className="mission-card" role="region" aria-labelledby="mc-heading">
      <div className="mc-top">
        <h2 id="mc-heading">Today’s mission</h2>
        <span className="demo-tag">Sample content</span>
      </div>
      <div className="mc-stage" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <Body key={bodyKey(demo)} demo={demo} />
        </AnimatePresence>
      </div>
      <div className="mc-progress">
        <p><b><CountUp value={demo.doneCount} /></b> of {demo.total} sample missions done <span>(demo progress, this browser only)</span></p>
        <ul className="bars">
          {FOCUSES.map((f) => {
            const n = demo.doneFor(f.id)
            return (
              <li key={f.id}>
                <span>{f.label}</span>
                <span className="meter" aria-hidden="true"><i style={{ transform: `scaleX(${n / 9})` }} /></span>
                <span className="bar-n">{n}/9</span>
              </li>
            )
          })}
        </ul>
        <button type="button" className="reset-btn" onClick={demo.reset}>
          <Refresh className="reset-icon" />
          Reset demo
        </button>
      </div>
    </div>
  )
}