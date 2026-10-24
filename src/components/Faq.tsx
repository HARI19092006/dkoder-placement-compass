import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FAQ } from '../data'
import SectionReveal from './SectionReveal'

export function FaqAccordion({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number[]>([])
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))
  return (
    <div className="faq">
      {items.map(([q, a], i) => {
        const isOpen = open.includes(i)
        return (
          <div key={q} className={isOpen ? 'faq-item open' : 'faq-item'}>
            <h3>
              <button id={`fq${i}`} type="button" aria-expanded={isOpen} aria-controls={`fa${i}`} onClick={() => toggle(i)}>
                <span>{q}</span>
                <i aria-hidden="true" />
              </button>
            </h3>
            <div id={`fa${i}`} role="region" aria-labelledby={`fq${i}`} hidden={!isOpen}>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.p
                    className="a"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Faq() {
  return (
    <section id="faq" className="faq-sec" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <SectionReveal className="sec-head">
          <h2 id="faq-title">Questions, answered plainly.</h2>
          <p className="lead">What this demo does, what it doesn’t, and what happens to your answers.</p>
        </SectionReveal>
        <FaqAccordion items={FAQ} />
      </div>
    </section>
  )
}
