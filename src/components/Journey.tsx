import { useState, type CSSProperties } from 'react'
import { JOURNEY } from '../data'

export default function Journey() {
  const [i, setI] = useState(0)
  const j = JOURNEY[i]
  return (
    <section id="journey" className="journey">
      <div className="wrap">
        <h2 data-reveal="up">A path, not a ladder.</h2>
        <p className="lead" data-reveal="up" style={{ '--i': 1 } as CSSProperties}>
          Start wherever you are today. Skip ahead, circle back, or stay put for a week. Pick a stone to see an example goal and mission.
        </p>
        <ol className="path" data-reveal="group">
          {JOURNEY.map((s, n) => (
            <li key={s.name} style={{ '--i': n } as CSSProperties}>
              <button className="stone" type="button" aria-label={s.name} aria-pressed={n === i} onClick={() => setI(n)}>
                {n + 1}
              </button>
              <span>{s.name}</span>
            </li>
          ))}
        </ol>
        <div className="detail" aria-live="polite">
          <div className="fade" key={'g' + i}><small>Example goal</small><h3>{j.goal}</h3></div>
          <div className="fade" key={'m' + i}><small>Example mission</small><p>{j.mission}</p></div>
        </div>
        <p className="note">Goals and missions shown here are illustrative examples, not real hiring content.</p>
      </div>
    </section>
  )
}