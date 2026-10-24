import { useCallback, useEffect, useMemo, useState } from 'react'
import { FOCUSES, TIMES, type Focus, type Mood, type Selection, type Time } from './data'
import { MISSION_BY_ID, MISSIONS, type Mission } from './missions'
import { anotherThan, easierThan, recommend, type Reason, type Recommendation } from './recommend'

const KEY = 'dkoder-demo-v2'
const OLD_KEY = 'dkoder-demo-v1'
const DEFAULT_FOCUS: Focus = 'code'
const DEFAULT_TIME: Time = '15'

export type Phase = 'active' | 'done' | 'stopped'

// Mood is deliberately kept in memory only. It is never written to storage.
export interface Choices { mood: Mood | null; focus: Focus; time: Time }

interface State {
  sel: Choices
  done: Record<string, true>
  pinned: { id: string; reason: Reason } | null
  phase: Phase
}

const isFocus = (v: unknown): v is Focus => typeof v === 'string' && FOCUSES.some((o) => o.id === v)
const isTime = (v: unknown): v is Time => typeof v === 'string' && TIMES.some((o) => o.id === v)
const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

function readJSON(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null')
  } catch {
    return null
  }
}

// Reads saved demo progress defensively. Anything malformed falls back to defaults.
function load(): State {
  const state: State = { sel: { mood: null, focus: DEFAULT_FOCUS, time: DEFAULT_TIME }, done: {}, pinned: null, phase: 'active' }

  const raw = readJSON(KEY)
  if (isRecord(raw)) {
    if (isFocus(raw.focus)) state.sel.focus = raw.focus
    if (isTime(raw.time)) state.sel.time = raw.time
    if (isRecord(raw.done)) {
      for (const [k, v] of Object.entries(raw.done)) if (v === true && MISSION_BY_ID.has(k)) state.done[k] = true
    }
    return state
  }

  // Migrate progress saved by the first version of the demo (one mission per focus/time).
  const old = readJSON(OLD_KEY)
  if (isRecord(old)) {
    if (isRecord(old.sel)) {
      if (isFocus(old.sel.focus)) state.sel.focus = old.sel.focus
      if (isTime(old.sel.time)) state.sel.time = old.sel.time
    }
    if (isRecord(old.done)) {
      for (const [k, v] of Object.entries(old.done)) {
        const match = /^(code|apt|int)(5|15|25)$/.exec(k)
        const id = match ? `${match[1]}-${match[2]}-2` : ''
        if (v === true && MISSION_BY_ID.has(id)) state.done[id] = true
      }
    }
  }
  try { localStorage.removeItem(OLD_KEY) } catch { /* storage unavailable */ }
  return state
}

export interface Demo {
  sel: Choices
  rec: Recommendation | null
  phase: Phase
  done: Readonly<Record<string, true>>
  doneCount: number
  total: number
  doneFor: (focus: Focus) => number
  easier: Mission | null
  setChoice: <K extends keyof Selection>(k: K, v: Selection[K]) => void
  tryEasier: () => void
  tryAnother: () => void
  complete: () => void
  stop: () => void
  resume: () => void
  reset: () => void
}

export function useDemo(): Demo {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ focus: state.sel.focus, time: state.sel.time, done: state.done }))
    } catch { /* storage unavailable: progress lives for this visit only */ }
  }, [state.sel.focus, state.sel.time, state.done])

  const { sel, done, pinned, phase } = state

  const rec = useMemo<Recommendation | null>(() => {
    if (!sel.mood) return null
    const pinnedMission = pinned ? MISSION_BY_ID.get(pinned.id) : undefined
    if (pinned && pinnedMission && pinnedMission.focus === sel.focus && pinnedMission.time === sel.time) {
      return { mission: pinnedMission, reason: pinned.reason }
    }
    return recommend({ mood: sel.mood, focus: sel.focus, time: sel.time }, done)
  }, [sel, done, pinned])

  const setChoice = useCallback(<K extends keyof Selection>(k: K, v: Selection[K]) => {
    // Any change to the check-in gives a fresh recommendation.
    setState((s) => ({ ...s, sel: { ...s.sel, [k]: v }, pinned: null, phase: 'active' }))
  }, [])

  const pin = (mission: Mission, reason: Reason) =>
    setState((s) => ({ ...s, pinned: { id: mission.id, reason }, phase: 'active' }))

  const easier = rec ? easierThan(rec.mission) : null

  return {
    sel,
    rec,
    phase,
    done,
    doneCount: Object.keys(done).length,
    total: MISSIONS.length,
    doneFor: (focus) => MISSIONS.filter((x) => x.focus === focus && done[x.id]).length,
    easier,
    setChoice,
    tryEasier: () => { if (easier) pin(easier, 'easier') },
    tryAnother: () => { if (rec) pin(anotherThan(rec.mission, done), 'another') },
    complete: () => {
      if (!rec) return
      const { mission, reason } = rec
      // Keep the finished mission on screen so the acknowledgement refers to it.
      setState((s) => ({ ...s, done: { ...s.done, [mission.id]: true }, pinned: { id: mission.id, reason }, phase: 'done' }))
    },
    stop: () => setState((s) => ({ ...s, phase: 'stopped' })),
    resume: () => setState((s) => ({ ...s, pinned: null, phase: 'active' })),
    reset: () => setState({ sel: { mood: null, focus: DEFAULT_FOCUS, time: DEFAULT_TIME }, done: {}, pinned: null, phase: 'active' }),
  }
}
