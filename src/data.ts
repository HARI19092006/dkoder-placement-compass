// Shared types, check-in options and page copy. Mission content lives in missions.ts,
// and the rules that pick a mission live in recommend.ts.

export type Mood = 'low' | 'overwhelmed' | 'focus' | 'confident'
export type Focus = 'code' | 'apt' | 'int'
export type Time = '5' | '15' | '25'
export type Destination = 'explore' | 'practise' | 'interview'

export interface Selection { mood: Mood; focus: Focus; time: Time }

export interface Option<T extends string> { id: T; label: string; hint: string }

export const MOODS: Option<Mood>[] = [
  { id: 'low', label: 'Low energy', hint: 'Something light with no setup' },
  { id: 'overwhelmed', label: 'A little overwhelmed', hint: 'One small, bounded task' },
  { id: 'focus', label: 'Ready to focus', hint: 'A bit more depth' },
  { id: 'confident', label: 'Feeling confident', hint: 'A gentle stretch' },
]

export const FOCUSES: Option<Focus>[] = [
  { id: 'code', label: 'Coding', hint: 'Loops, arrays, small problems' },
  { id: 'apt', label: 'Aptitude', hint: 'Percentages, series, ratios' },
  { id: 'int', label: 'Interview confidence', hint: 'Intros, project stories' },
]

export const TIMES: Option<Time>[] = [
  { id: '5', label: '5 minutes', hint: 'A quick win' },
  { id: '15', label: '15 minutes', hint: 'One focused task' },
  { id: '25', label: '25 minutes', hint: 'Room to go deeper' },
]

export const label = {
  mood: (m: Mood) => MOODS.find((o) => o.id === m)?.label ?? m,
  focus: (f: Focus) => FOCUSES.find((o) => o.id === f)?.label ?? f,
}

// The three compass destinations. Each practice focus has a home destination,
// which is what the compass needle points to.
export interface DestinationInfo {
  id: Destination
  name: string
  focus: Focus
  caption: string
  goal: string
  example: string
  whenUseful: string
}

export const DESTINATIONS: DestinationInfo[] = [
  {
    id: 'explore',
    name: 'Explore',
    focus: 'apt',
    caption: 'Aptitude warm-ups',
    goal: 'Get familiar with the kinds of questions placement tests ask.',
    example: 'Try three sample number series and name each rule in words.',
    whenUseful: 'Useful when you are not sure where to begin. Feedback is quick and nothing is at stake.',
  },
  {
    id: 'practise',
    name: 'Practise',
    focus: 'code',
    caption: 'Coding reps',
    goal: 'Make small coding problems feel routine instead of scary.',
    example: 'Write one short array function, then explain it in a sentence.',
    whenUseful: 'Useful when you want steady repetition. Small problems, done often, add up.',
  },
  {
    id: 'interview',
    name: 'Interview',
    focus: 'int',
    caption: 'Speaking practice',
    goal: 'Get comfortable talking about yourself and your work out loud.',
    example: 'Say a three-sentence introduction aloud, then change one line.',
    whenUseful: 'Useful at any stage. You can practise speaking before you feel ready.',
  },
]

export const destinationFor = (f: Focus): DestinationInfo =>
  DESTINATIONS.find((d) => d.focus === f) ?? DESTINATIONS[0]

export const JOURNEY_STEPS: { title: string; text: string }[] = [
  { title: 'Check in', text: 'Say how today feels. Low energy is a fine starting point.' },
  { title: 'Choose a focus', text: 'Coding, aptitude or interview confidence, plus the time you have.' },
  { title: 'Get one mission', text: 'One task, a clear finish line, and a note on why it fits.' },
  { title: 'Practise', text: 'Do just that. Ask for something easier if it feels like too much.' },
  { title: 'Reflect', text: 'Mark it done and read one suggestion for what could follow.' },
  { title: 'Choose what’s next', text: 'Another mission, a different focus, or stop for the day.' },
]

export const FAQ: [string, string][] = [
  ['Is this a real product?', 'No. It’s a frontend demo built for a hackathon. There is no backend, no AI and no real placement data. Suggestions come from 27 sample missions written for this page.'],
  ['How are missions chosen?', 'By a short, fixed rule. Your focus and time pick a set of three sample missions (gentle, steady, stretch). Your mood picks which of the three to suggest first. “Make it easier” and “Try another” move between them. It is not a prediction about you.'],
  ['Does my mood get saved?', 'No. Your mood only shapes the suggestion on screen and is forgotten when you leave. Only your last focus, time and completed sample missions are kept, in this browser.'],
  ['Is my progress real?', 'It’s demo progress. Completed missions are saved in this browser’s local storage, so clearing site data or pressing “Reset demo” removes them.'],
  ['Do I need to log in?', 'No. There are no accounts and nothing leaves your device.'],
  ['Who is it for?', 'College students preparing for internships, campus placements and entry-level roles, especially on days when they don’t know where to start.'],
]
