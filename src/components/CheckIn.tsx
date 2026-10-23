import { useState, type CSSProperties } from 'react'
import { MISSIONS, OPTIONS, TIPS, type Selection } from '../data'
import { useDemo } from '../useDemo'

type Demo = ReturnType<typeof useDemo>

// Confetti directions, computed once
const PARTS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2
  const r = 70 + (i % 3) * 24
  return { x: Math.round(Math.cos(a) * r), y: Math.round(Math.sin(a) * r) }
})

function ChipGroup<K extends keyof Selection>({ k, legend, demo }: { k: K; legend: string; demo: Demo }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className="chips">
        {OPTIONS[k].map((o) => (
          <button
            key={o.id}
            type="button"
            className="chip"
            aria-pressed={demo.sel[k] === o.id}
            onClick={() => demo.setChoice(k, o.id as Selection[K])}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export default function CheckIn({ demo }: { demo: Demo }) {
  const { sel, isDone, doneCount } = demo
  const [burst, setBurst] = useState(0)
  const [title, text] = MISSIONS[sel.focus][sel.time]
  const focusLabel = OPTIONS.focus.find((o) => o.id === sel.focus)!.label

  const complete = () => {
    demo.complete()
    setBurst((b) => b + 1)
  }

  return (
    <div className="card" id="checkin" role="group" aria-labelledby="ciT">
      <span className="demo">Demo · sample missions, saved only in this browser</span>
      <h2 id="ciT" style={{ fontSize: '1.7rem' }}>Today’s check-in</h2>
      <ChipGroup k="mood" legend="How are you feeling?" demo={demo} />
      <ChipGroup k="focus" legend="What do you want to work on?" demo={demo} />
      <ChipGroup k="time" legend="How much time do you have?" demo={demo} />

      <div aria-live="polite">
        <div className="mission pop" key={demo.missionId + sel.mood}>
          <small>Sample mission · {sel.time} min · {focusLabel}</small>
          <h3>{title}</h3>
          <p>{text}</p>
          <p className="why">
            <b>Why this fits:</b> {TIPS[sel.mood]} A {sel.time}-minute {focusLabel.toLowerCase()} task keeps today small.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="btnwrap">
          <button className="btn" disabled={isDone} onClick={complete}>
            {isDone ? '✓ Completed' : 'Mark complete'}
          </button>
          {burst > 0 && (
            <span className="burst" key={burst} aria-hidden="true">
              {PARTS.map((p, i) => (
                <i key={i} style={{ '--x': `${p.x}px`, '--y': `${p.y}px` } as CSSProperties} />
              ))}
            </span>
          )}
        </div>
        <div className="prog">
          <span>{doneCount} of 9 sample missions done</span>
          <div className="dots" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => <i key={i} className={i < doneCount ? 'on' : ''} />)}
          </div>
        </div>
      </div>
      <div className="row" style={{ marginTop: 4 }}>
        <span style={{ fontSize: '.85rem', color: 'var(--mute)' }}>Progress is demo-only, stored in this browser.</span>
        <button className="link" onClick={demo.reset}>Reset demo</button>
      </div>
    </div>
  )
}