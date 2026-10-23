export type Mood = 'stuck' | 'focus' | 'short'
export type Focus = 'code' | 'apt' | 'int'
export type Time = '5' | '15' | '25'
export interface Selection { mood: Mood; focus: Focus; time: Time }

interface Opt<T> { id: T; label: string }
export const OPTIONS: { mood: Opt<Mood>[]; focus: Opt<Focus>[]; time: Opt<Time>[] } = {
  mood: [
    { id: 'stuck', label: 'A bit stuck' },
    { id: 'focus', label: 'Ready to focus' },
    { id: 'short', label: 'Short on time' },
  ],
  focus: [
    { id: 'code', label: 'Coding' },
    { id: 'apt', label: 'Aptitude' },
    { id: 'int', label: 'Interview confidence' },
  ],
  time: [
    { id: '5', label: '5 minutes' },
    { id: '15', label: '15 minutes' },
    { id: '25', label: '25 minutes' },
  ],
}

// Fictional sample missions: [title, description]
export const MISSIONS: Record<Focus, Record<Time, [string, string]>> = {
  code: {
    '5': ['Trace a loop by hand', 'Read a six-line loop. Write down each variable’s value after every pass.'],
    '15': ['Warm up with one array problem', 'Find the largest number in a short list. Write it, then explain it in one sentence.'],
    '25': ['Solve it, then tidy it', 'Solve a sample string problem, rename your variables for clarity, and note one edge case.'],
  },
  apt: {
    '5': ['Percentages without a calculator', 'Work three sample percentage-change questions in your head, then check them.'],
    '15': ['Spot the pattern', 'Try five sample number series. Note which pattern type you recognised first.'],
    '25': ['A mixed set, no timer', 'Do eight mixed sample questions with no clock. Mark the ones you’d skip first next time.'],
  },
  int: {
    '5': ['Say your intro aloud', 'Three sentences: who you are, something you’ve built or learned, and what you want next.'],
    '15': ['Draft one project story', 'Write what problem you faced, what you did, and one thing you’d change.'],
    '25': ['Record a practice answer', 'Answer “Tell me about a challenge” aloud, listen back, and note one thing to keep and one to tweak.'],
  },
}

export const TIPS: Record<Mood, string> = {
  stuck: 'Since you feel a bit stuck, this starts with something concrete. Begin with just the first line.',
  focus: 'You’re ready to focus, so this one has a little more depth to it.',
  short: 'You’re short on time, so there’s nothing to set up and one clear finish line.',
}

export const JOURNEY: { name: string; goal: string; mission: string }[] = [
  { name: 'Explore', goal: 'Learn what roles exist', mission: 'Read two sample role descriptions and note what sounds interesting. (5 min)' },
  { name: 'Build basics', goal: 'Feel steady with core ideas', mission: 'Write one small function from scratch without looking anything up. (15 min)' },
  { name: 'Practise', goal: 'Make practice a habit', mission: 'Do one sample mixed set, then jot down what felt easy. (25 min)' },
  { name: 'Prepare to apply', goal: 'Get your story ready', mission: 'Draft a three-line summary of your best project. (15 min)' },
  { name: 'Reflect', goal: 'Notice what you’ve learned', mission: 'Write one thing you’re proud of and one thing to try next. (5 min)' },
]

export const FAQ: [string, string][] = [
  ['Is this a real product?', 'No. It’s a frontend demo. There is no backend, no AI and no real placement data. Suggestions come from a small set of sample missions written for this page.'],
  ['Do I need to log in?', 'No. There are no accounts. Nothing leaves your device.'],
  ['Is my progress real?', 'It’s demo progress. Completed missions are saved in your browser’s local storage, so clearing site data or pressing Reset demo removes them.'],
  ['Who is it for?', 'College students preparing for internships, campus placements and entry-level roles, especially on days when they don’t know where to start.'],
  ['How are missions chosen?', 'Your mood, focus area and time map to a sample mission and a short note explaining the match. It’s a simple rule, not a prediction.'],
]