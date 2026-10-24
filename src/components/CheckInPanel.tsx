import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { FOCUSES, MOODS, TIMES, type Option, type Selection } from '../data'
import type { Choices } from '../useDemo'
import { Clock, ColorChart, ColorChat, ColorCode } from './icons'

interface Props {
  sel: Choices
  onChange: <K extends keyof Selection>(k: K, v: Selection[K]) => void
}

const ICONS: Record<string, ReactNode> = {
  low: <span className="emoji">⚡</span>,
  overwhelmed: <span className="emoji">🧠</span>,
  focus: <span className="emoji">🎯</span>,
  confident: <span className="emoji">☀️</span>,
  code: <ColorCode />,
  apt: <ColorChart />,
  int: <ColorChat />,
  '5': <Clock minutes={5} />,
  '15': <Clock minutes={15} />,
  '25': <Clock minutes={25} />,
}

interface GroupProps<K extends keyof Selection> {
  k: K
  step: number
  legend: string
  options: Option<Selection[K]>[]
  value: Selection[K] | null
  onChange: (v: Selection[K]) => void
  note?: string
}

function ChoiceGroup<K extends keyof Selection>({ k, step, legend, options, value, onChange, note }: GroupProps<K>) {
  return (
    <fieldset id={`q-${k}`} className="q">
      <legend>
        <span className="q-num" aria-hidden="true">{step}</span>
        {legend}
      </legend>
      <div className={`choices choices-${k}`}>
        {options.map((o) => {
          const checked = value === o.id
          return (
            <motion.label key={o.id} className="choice" whileTap={{ scale: 0.97 }}>
              <input type="radio" name={k} value={o.id} checked={checked} onChange={() => onChange(o.id)} />
              <span className="choice-face">
                <span className="choice-icon" aria-hidden="true">{ICONS[o.id]}</span>
                <span className="choice-text">
                  <span className="choice-label">{o.label}</span>
                  <span className="choice-hint">{o.hint}</span>
                </span>
              </span>
              {checked && (
                <motion.span
                  layoutId={`choice-${k}`}
                  className="choice-hl"
                  aria-hidden="true"
                  transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                />
              )}
            </motion.label>
          )
        })}
      </div>
      {note && <p className="q-note">{note}</p>}
    </fieldset>
  )
}

export default function CheckInPanel({ sel, onChange }: Props) {
  return (
    <div className="checkin-panel">
      <ChoiceGroup
        k="mood"
        step={1}
        legend="How are you feeling today?"
        options={MOODS}
        value={sel.mood}
        onChange={(v) => onChange('mood', v)}
        note="This only shapes today’s suggestion. It isn’t saved anywhere."
      />
      <ChoiceGroup k="focus" step={2} legend="What would you like to practise?" options={FOCUSES} value={sel.focus} onChange={(v) => onChange('focus', v)} />
      <ChoiceGroup k="time" step={3} legend="How much time do you have?" options={TIMES} value={sel.time} onChange={(v) => onChange('time', v)} />
    </div>
  )
}