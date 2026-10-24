import { useCallback, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import CheckIn from './components/CheckIn'
import Journey from './components/Journey'
import Faq from './components/Faq'
import Preloader from './components/Preloader'
import CursorFollower from './components/CursorFollower'
import MissionMarquee from './components/MissionMarquee'
import { ClosingCta, HowItWorks, Principles } from './components/Sections'
import { Stack, StackPanel } from './components/Stack'
import { startSmoothScroll } from './smoothScroll'
import { useDemo } from './useDemo'

const REPO = 'https://github.com/HARI19092006/dkoder-placement-compass'

export default function App() {
  const demo = useDemo()
  const [ready, setReady] = useState(false)
  const markReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    const t = window.setTimeout(markReady, 4000)
    return () => window.clearTimeout(t)
  }, [markReady])

  useEffect(() => startSmoothScroll(), [])

  return (
    <MotionConfig reducedMotion="user">
      <Preloader onDone={markReady} />
      <CursorFollower />
      <a className="skip" href="#checkin">Skip to the check-in</a>
      <Header />
      <main id="top">
        <Stack>
          <StackPanel index={0} className="panel-hero">
            <HeroSection focus={demo.sel.focus} onPickFocus={(f) => demo.setChoice('focus', f)} ready={ready} />
          </StackPanel>
          <StackPanel index={1}>
            <MissionMarquee />
            <CheckIn demo={demo} />
          </StackPanel>
          <StackPanel index={2}>
            <HowItWorks />
          </StackPanel>
          <StackPanel index={3}>
            <Journey demo={demo} />
          </StackPanel>
          <StackPanel index={4}>
            <Principles />
          </StackPanel>
          <StackPanel index={5} last>
            <Faq />
            <ClosingCta />
          </StackPanel>
        </Stack>
      </main>
      <footer>
        <div className="wrap foot">
          <p>
            Dkoder Placement Compass is a student hackathon demo. It has no login, no backend, no AI and no real placement
            data. Missions are fictional examples, and progress is saved only in this browser.
          </p>
          <p><a href={REPO} target="_blank" rel="noreferrer">Source code on GitHub</a></p>
        </div>
      </footer>
    </MotionConfig>
  )
}