# Dkoder – placement prep, one doable step at a time

A frontend-only React prototype. A student checks in (mood, focus, time) and gets one small sample "mission" to finish now.

## Demo behaviour
- No backend, login, AI or real placement data.
- Missions are fictional examples written for this page.
- "Mark complete" progress is saved in this browser's localStorage only. "Reset demo" clears it.

## Tech stack
React 18, TypeScript, Vite. Plain CSS (`src/styles.css`). No UI or animation libraries.

## Run locally
```
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Structure
```
src/
  App.tsx              page layout and static sections
  components/          Header, CheckIn, Journey, Faq
  data.ts              sample missions, journey stages, FAQ copy
  useDemo.ts           state + defensive localStorage hook
  styles.css           design tokens and all styles
```