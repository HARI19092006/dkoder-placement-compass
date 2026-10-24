# Dkoder Placement Compass

**When placement preparation feels overwhelming, Dkoder helps you find one realistic next step.**

A frontend-only React prototype for college students preparing for internships and campus placements. A student checks in (how they feel, what they want to practise, how much time they have) and gets one small sample mission with a clear finish line and a plain explanation of why it was suggested.

Live demo: https://dkoder-placement-compass.vercel.app/

## The student problem

Placement prep usually arrives as a huge list: DSA sheets, aptitude books, mock interviews. On a tired or anxious day that list makes it harder to start. Dkoder shrinks the decision to one task that fits the time and energy you actually have, and makes stopping afterwards feel normal rather than like failure. There are no streaks, ranks or countdowns.

## Core interactions

- **Placement Compass (hero).** A 3D compass with three destinations: Explore (aptitude warm-ups), Practise (coding reps) and Interview (speaking practice). The needle points at the destination for your current focus. The destination labels are buttons that change your focus.
- **Check-in.** Three questions using native radio groups (keyboard arrows work): mood, focus, time.
- **Mission card.** Title, focus, duration, difficulty (gentle / steady / stretch), the task, a "done when" finish line and a "why this fits" note. Controls: *Mark as done*, *Make it easier*, *Try another*, *Change my focus*.
- **After completion.** A calm acknowledgement, a suggested next step, and the choice to continue, change focus or stop for today.
- **Destinations map.** Three connected destinations with no fixed order, each showing an example mission and your demo progress there.
- **FAQ**, light/dark theme, mobile menu (closes on Escape or link tap).

## How missions are chosen

The logic is in `src/recommend.ts` and is deliberately simple. It is not AI and makes no judgement about ability.

1. Focus + time pick a set of three sample missions (gentle, steady, stretch). There are 27 in total (`src/missions.ts`).
2. Mood picks the starting level: low energy or a little overwhelmed → gentle, ready to focus → steady, feeling confident → stretch.
3. If that mission is already completed, the nearest open level is used instead.
4. *Make it easier* steps down one level within the same focus and time. *Try another* moves to the next level and skips completed ones when possible.

## Privacy and storage

- Mood is kept in memory only and is never saved.
- Last focus, last time and completed sample missions are saved in this browser's `localStorage` (`dkoder-demo-v2`). Malformed values are ignored. Progress from the first version (`dkoder-demo-v1`) is migrated once.
- *Reset demo* clears progress. The theme choice is stored separately (`dkoder-theme`).

## Tech stack

- React 18, TypeScript, Vite 5, plain CSS (`src/styles.css`).
- **three + @react-three/fiber v8** for the hero compass, built only from basic geometry. It loads as a separate chunk after the page is usable, renders continuously only while on screen, renders still frames on demand for reduced-motion users, caps pixel ratio and simplifies geometry on small screens. If WebGL is unavailable or the scene fails, an SVG compass with the same layout is shown.
- **Motion** (`motion/react`) for the hero entrance, section-heading reveals, mission-card transitions, completion tick and tap feedback. `<MotionConfig reducedMotion="user">` respects the system reduced-motion setting.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

On Windows PowerShell use `npm.cmd` (for example `npm.cmd run dev`).

## Structure

```
src/
  App.tsx                         page composition
  data.ts                         types, check-in options, destinations, FAQ copy
  missions.ts                     27 typed sample missions
  recommend.ts                    recommendation rules (pure functions)
  useDemo.ts                      state, safe localStorage, actions
  compass.ts                      shared compass geometry + WebGL check
  focusCheckin.ts                 moves keyboard focus to a check-in question
  components/
    Header.tsx                    nav, theme toggle, mobile menu
    HeroSection.tsx               headline + compass
    CompassStage.tsx              lazy 3D scene, fallback, destination buttons
    PlacementCompassScene.tsx     React Three Fiber scene
    CompassDial.tsx               SVG compass (fallback and mini marker)
    CheckIn.tsx                   check-in section layout
    CheckInPanel.tsx              the three questions
    MissionCard.tsx               mission, completion and progress states
    Journey.tsx                   destinations map
    Sections.tsx                  how it works, principles, closing CTA
    SectionReveal.tsx             heading reveal animation
    Faq.tsx                       FaqAccordion
```

## Demo limitations

- All missions, destinations and examples are fictional sample content.
- Progress is demo progress stored in one browser; it is not real student data.
- No backend, login, accounts, analytics or AI service.

## Deploy

The site is deployed on Vercel from this GitHub repository. Pushing to the connected branch triggers a new build (`npm run build`, output `dist/`). No environment variables are needed.
