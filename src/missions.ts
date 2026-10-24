import type { Focus, Time } from './data'

// 1 = gentle, 2 = steady, 3 = stretch
export type Level = 1 | 2 | 3

export interface Mission {
  id: string
  focus: Focus
  time: Time
  level: Level
  title: string
  task: string
  doneWhen: string
  next: string
}

export const LEVEL_NAME: Record<Level, string> = { 1: 'Gentle', 2: 'Steady', 3: 'Stretch' }

// Fictional sample missions written for this demo. Every focus × time pair has
// exactly one gentle, one steady and one stretch version.
const m = (focus: Focus, time: Time, level: Level, title: string, task: string, doneWhen: string, next: string): Mission => ({
  id: `${focus}-${time}-${level}`,
  focus,
  time,
  level,
  title,
  task,
  doneWhen,
  next,
})

export const MISSIONS: Mission[] = [
  // Coding
  m('code', '5', 1, 'Read one loop, line by line',
    'Look at a loop that prints i × 2 for i = 0, 1, 2. Write down the three values it prints before you run anything.',
    'You have written three numbers and checked them.',
    'Change the loop to run four times and predict the new output.'),
  m('code', '5', 2, 'Trace a loop by hand',
    'Read a six-line loop. Write down each variable’s value after every pass.',
    'You have a small table with one row per pass.',
    'Run the loop and compare the real values with your table.'),
  m('code', '5', 3, 'Find the off-by-one',
    'Write a loop that prints 1 to 10. Change one boundary and predict exactly what breaks.',
    'You can explain the bug in one sentence.',
    'Look for the same boundary pattern in an old solution of yours.'),

  m('code', '15', 1, 'Add up a short list',
    'Write a function that returns the sum of five numbers in a list. Test it with one example you work out by hand.',
    'Your function returns the number you expected.',
    'Make it return the average instead and test it again.'),
  m('code', '15', 2, 'Warm up with one array problem',
    'Find the largest number in a short list. Write it, then explain your approach in one sentence.',
    'Your code works and you have a one-sentence explanation.',
    'Try the same problem for the second-largest number.'),
  m('code', '15', 3, 'Reverse it two ways',
    'Reverse an array once by building a new array, and once in place. Note which one uses less extra memory.',
    'Both versions work and you have noted the memory difference.',
    'Explain the in-place version aloud as if to an interviewer.'),

  m('code', '25', 1, 'Rebuild a solved problem',
    'Pick a problem you solved before. Hide the old answer, write it again from memory, then compare the two.',
    'You have a working solution and one note on what changed.',
    'Pick one line you could make clearer and rename it.'),
  m('code', '25', 2, 'Solve it, then tidy it',
    'Solve a sample string problem, rename your variables for clarity, and note one edge case.',
    'The code runs, reads clearly, and has one edge case written down.',
    'Write a quick test for the edge case you noted.'),
  m('code', '25', 3, 'Count, then explain the cost',
    'Count how often each character appears in a string. Then say its time and space cost out loud.',
    'Your counts are correct and you have stated the cost in plain words.',
    'Find the most frequent character without a second pass.'),

  // Aptitude
  m('apt', '5', 1, 'One percentage, two ways',
    'Work out 20% of 150 twice: once as 10% doubled, once as a fraction. Check that both match.',
    'Both methods give the same answer.',
    'Try 35% of 240 with whichever method felt faster.'),
  m('apt', '5', 2, 'Percentages without a calculator',
    'Work three sample percentage-change questions in your head, then check them on paper.',
    'You have three answers and know which ones you got right.',
    'Redo any you missed, writing out each step.'),
  m('apt', '5', 3, 'Successive changes',
    'A price rises 10%, then falls 10%. Work out the net change and explain why it isn’t zero.',
    'You have the net change and a one-line reason.',
    'Try a rise of 20% followed by a fall of 20%.'),

  m('apt', '15', 1, 'Spot one kind of pattern',
    'Try three sample number series that each add or multiply by a constant. Name the rule before writing the next term.',
    'You have named three rules.',
    'Write a series of your own that uses one of those rules.'),
  m('apt', '15', 2, 'Spot the pattern',
    'Try five sample number series. Note which pattern type you recognised first.',
    'Five attempts, with the first-recognised pattern noted.',
    'Look at the one you found hardest and name its rule in words.'),
  m('apt', '15', 3, 'Mixed patterns',
    'Try five series that mix two rules, such as alternating steps. Write each rule in words.',
    'Each series has its two rules written down.',
    'Make one mixed series yourself and swap it with a friend.'),

  m('apt', '25', 1, 'Six questions, one topic',
    'Pick ratios or percentages. Do six sample questions on just that topic, with no timer.',
    'Six questions attempted on a single topic.',
    'Write down the one step you most often had to think about.'),
  m('apt', '25', 2, 'A mixed set, no timer',
    'Do eight mixed sample questions with no clock. Mark the ones you would skip first next time.',
    'Eight attempts, with your skip-first questions marked.',
    'Revisit one skipped question and solve it slowly.'),
  m('apt', '25', 3, 'Timed, then reviewed',
    'Do ten mixed sample questions in 15 minutes. Spend the other 10 reviewing only the ones you missed or guessed.',
    'You have reviewed every missed or guessed question.',
    'Group your misses by topic to see which one to practise next.'),

  // Interview confidence
  m('int', '5', 1, 'Write your intro first',
    'Write three short sentences: who you are, one thing you’ve built or learned, and what you are looking for.',
    'Three sentences on paper. No need to say them yet.',
    'Read them aloud once, quietly, when you feel ready.'),
  m('int', '5', 2, 'Say your intro aloud',
    'Three sentences: who you are, something you’ve built or learned, and what you want next. Say them out loud.',
    'You have said your intro aloud at least once.',
    'Say it again and change the sentence that felt stiffest.'),
  m('int', '5', 3, 'Intro with a hook',
    'Say your intro aloud and end with one specific detail an interviewer would want to ask about.',
    'Your intro ends with a concrete detail.',
    'Prepare a two-sentence answer for the question that detail invites.'),

  m('int', '15', 1, 'List what you could talk about',
    'Write one line for each project, course or club you could discuss. Circle the one you understand best.',
    'A short list with one item circled.',
    'Write two sentences about the circled one.'),
  m('int', '15', 2, 'Draft one project story',
    'Write the problem you faced, what you did, and one thing you would change.',
    'A three-part story you could read aloud.',
    'Cut it down so it takes under a minute to say.'),
  m('int', '15', 3, 'A project in four sentences',
    'Explain one project aloud in four sentences: the problem, your part, a hard moment, and the result. Record it if you like.',
    'You have said all four sentences in order.',
    'Listen back and keep one phrase that sounded natural.'),

  m('int', '25', 1, 'Answer one question in writing',
    'Write a short answer to “Why do you want this role?” Read it back once and change one sentence.',
    'A written answer with one sentence improved.',
    'Say the answer aloud without reading it word for word.'),
  m('int', '25', 2, 'Record a practice answer',
    'Answer “Tell me about a challenge” aloud, listen back, and note one thing to keep and one to tweak.',
    'One recording, one keep and one tweak noted.',
    'Record it once more using your tweak.'),
  m('int', '25', 3, 'Explain a concept aloud',
    'Explain one technical concept, such as arrays versus linked lists, aloud for two minutes. Then answer a follow-up question you write for yourself.',
    'You have explained the concept and answered your own follow-up.',
    'Write down the follow-up you would find hardest and draft an answer.'),
]

export const MISSION_BY_ID: ReadonlyMap<string, Mission> = new Map(MISSIONS.map((x) => [x.id, x]))

export const missionsFor = (focus: Focus, time: Time): Mission[] =>
  MISSIONS.filter((x) => x.focus === focus && x.time === time).sort((a, b) => a.level - b.level)
