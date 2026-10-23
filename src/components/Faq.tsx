import { useState } from 'react'
import { FAQ } from '../data'

export default function Faq() {
  const [open, setOpen] = useState<number[]>([])
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))
  return (
    <section id="faq">
      <div className="wrap">
        <h2 data-reveal="up">Questions, answered plainly.</h2>
        <div className="faq" data-reveal="up">
          {FAQ.map(([q, a], i) => {
            const isOpen = open.includes(i)
            return (
              <div key={q}>
                <h3>
                  <button id={`fq${i}`} type="button" aria-expanded={isOpen} aria-controls={`fa${i}`} onClick={() => toggle(i)}>
                    <span>{q}</span>
                    <i aria-hidden="true">+</i>
                  </button>
                </h3>
                <div id={`fa${i}`} className="a" role="region" aria-labelledby={`fq${i}`} hidden={!isOpen}>{a}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}