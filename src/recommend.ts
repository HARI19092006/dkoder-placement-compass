import type { Mood, Selection } from './data'
import { LEVEL_NAME, missionsFor, type Level, type Mission } from './missions'

/*
  How a sample mission is chosen (a fixed rule, not AI and not a judgement of ability):

  1. Focus + time select the three missions for that pair (gentle, steady, stretch).
  2. Mood sets the starting level:
       low energy → gentle, a little overwhelmed → gentle,
       ready to focus → steady, feeling confident → stretch.
  3. If that one is already completed, the nearest level not yet completed is used,
     so the same mission is not shown again while alternatives remain.
  4. "Make it easier" steps down one level. "Try another" moves to the next level,
     wrapping around, and skips completed ones when it can.
*/

export type Reason = 'match' | 'nearby' | 'easier' | 'another'

export interface Recommendation {
  mission: Mission
  reason: Reason
}

export const MOOD_LEVEL: Record<Mood, Level> = { low: 1, overwhelmed: 1, focus: 2, confident: 3 }

type Done = Readonly<Record<string, true>>

export function recommend(sel: Selection, done: Done): Recommendation {
  const pool = missionsFor(sel.focus, sel.time)
  const target = MOOD_LEVEL[sel.mood]
  const exact = pool.find((x) => x.level === target) ?? pool[0]
  if (!done[exact.id]) return { mission: exact, reason: 'match' }

  // Nearest level that is still open; on a tie prefer the gentler one.
  const open = pool
    .filter((x) => !done[x.id])
    .sort((a, b) => Math.abs(a.level - target) - Math.abs(b.level - target) || a.level - b.level)
  return open.length ? { mission: open[0], reason: 'nearby' } : { mission: exact, reason: 'match' }
}

export function easierThan(current: Mission): Mission | null {
  const pool = missionsFor(current.focus, current.time)
  const lower = pool.filter((x) => x.level < current.level)
  return lower.length ? lower[lower.length - 1] : null
}

export function anotherThan(current: Mission, done: Done): Mission {
  const pool = missionsFor(current.focus, current.time)
  const start = pool.findIndex((x) => x.id === current.id)
  const rest = pool.map((_, i) => pool[(start + 1 + i) % pool.length]).filter((x) => x.id !== current.id)
  return rest.find((x) => !done[x.id]) ?? rest[0] ?? current
}

const MOOD_NOTE: Record<Mood, string> = {
  low: 'Energy is low today, so this one needs no setup and has an obvious finish line.',
  overwhelmed: 'When everything feels like a lot, one bounded task is easier to start. This one has a single clear end point.',
  focus: 'You’re ready to focus, so this gives you a little more to work with.',
  confident: 'You’re feeling confident, so this one reaches a bit further.',
}

export function explain(rec: Recommendation, sel: Selection): string {
  const level = LEVEL_NAME[rec.mission.level].toLowerCase()
  const fits = `It fits inside your ${sel.time} minutes.`
  switch (rec.reason) {
    case 'easier':
      return `You asked for something lighter, so this is the ${level} version with the same focus and time. ${fits}`
    case 'another':
      return `You asked for a different option, so this is the ${level} version. ${fits}`
    case 'nearby':
      return `${MOOD_NOTE[sel.mood]} You’ve already done the usual pick here, so this is the ${level} one beside it. ${fits}`
    default:
      return `${MOOD_NOTE[sel.mood]} ${fits}`
  }
}
