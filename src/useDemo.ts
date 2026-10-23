import { useEffect, useState } from 'react'
import { OPTIONS, type Selection } from './data'

const KEY = 'dkoder-demo-v1'
const DEFAULT: Selection = { mood: 'stuck', focus: 'code', time: '15' }

interface State { sel: Selection; done: Record<string, true> }

function valid<K extends keyof Selection>(k: K, v: unknown): v is Selection[K] {
  return typeof v === 'string' && OPTIONS[k].some((o) => o.id === v)
}

// Reads localStorage defensively: bad JSON or odd shapes fall back to defaults.
function load(): State {
  const state: State = { sel: { ...DEFAULT }, done: {} }
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (raw && typeof raw === 'object') {
      const s = raw.sel
      if (s && typeof s === 'object') {
        if (valid('mood', s.mood)) state.sel.mood = s.mood
        if (valid('focus', s.focus)) state.sel.focus = s.focus
        if (valid('time', s.time)) state.sel.time = s.time
      }
      const d = raw.done
      if (d && typeof d === 'object' && !Array.isArray(d)) {
        for (const k of Object.keys(d)) {
          if (/^(code|apt|int)(5|15|25)$/.test(k) && d[k] === true) state.done[k] = true
        }
      }
    }
  } catch {
    /* ignore: storage blocked or corrupted */
  }
  return state
}

export function useDemo() {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  const missionId = state.sel.focus + state.sel.time
  return {
    sel: state.sel,
    missionId,
    isDone: !!state.done[missionId],
    doneCount: Object.keys(state.done).length,
    setChoice: <K extends keyof Selection>(k: K, v: Selection[K]) =>
      setState((s) => ({ ...s, sel: { ...s.sel, [k]: v } })),
    complete: () => setState((s) => ({ ...s, done: { ...s.done, [s.sel.focus + s.sel.time]: true } })),
    reset: () => setState({ sel: { ...DEFAULT }, done: {} }),
  }
}