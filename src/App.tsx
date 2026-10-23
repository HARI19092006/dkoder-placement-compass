import type { CSSProperties } from 'react'
import Header from './components/Header'
import CheckIn from './components/CheckIn'
import Journey from './components/Journey'
import Faq from './components/Faq'
import { MISSIONS } from './data'
import { useDemo } from './useDemo'
import { useReveal } from './useReveal'
import { focusCheckin } from './focusCheckin'

const d = (i: number) => ({ '--i': i }) as CSSProperties

// Sample mission titles for the scrolling band (decorative, repeated for a seamless loop)
const TITLES = Object.values(MISSIONS).flatMap((byTime) => Object.values(byTime).map((m) => m[0]))
const BAND = ['Sample missions', ...TITLES]

export default function App() {
  const demo = useDemo()
  useReveal()
  return (
    <>
      <Header />
      <main id="top">
        <section className="hero">
          <div className="orbs" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="wrap hgrid">
            <div>
              <h1>
                <span className="ln rise" style={d(0)}>Placement prep,</span>
                <span className="ln rise" style={d(1)}><span className="hl">one doable step</span></span>
                <span className="ln rise" style={d(2)}>at a time.</span>
              </h1>
              <p className="lead rise" style={d(3)}>
                You have a full timetable, a long list of things to learn, and no clear place to begin. Dkoder turns that into one small mission you can finish today.
              </p>
              <div className="ctas rise" style={d(4)}>
                <a className="btn" href="#checkin" onClick={focusCheckin}>Find my next step</a>
                <a className="btn ghost" href="#how">See how it works</a>
              </div>
              <p className="promise rise" style={d(5)}>You don’t need your whole career figured out. Just your next 20 minutes.</p>
              <div className="trail" aria-hidden="true">
                <svg viewBox="0 0 520 80">
                  <path d="M12 56 L140 24 L262 58 L384 22 L504 44" />
                  <circle cx="12" cy="56" r="9" />
                  <circle cx="140" cy="24" r="9" />
                  <circle cx="262" cy="58" r="9" />
                  <circle cx="384" cy="22" r="9" />
                  <circle className="end" cx="504" cy="44" r="12" />
                </svg>
              </div>
            </div>
            <CheckIn demo={demo} />
          </div>
        </section>

        <div className="marq" aria-hidden="true">
          <div className="track">
            {[...BAND, ...BAND].map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>

        <section id="how">
          <div className="wrap">
            <h2 data-reveal="up">Three taps. One useful mission.</h2>
            <p className="lead" data-reveal="up" style={d(1)}>No plans to build, no streaks to protect. Dkoder asks three small questions and hands back one thing to do now.</p>
            <div className="flow">
              <div className="step" data-reveal="up" style={d(0)}><b>1</b><h3>Check in</h3><p>Say how you feel: stuck, ready, or short on time. All three are fine starting points.</p></div>
              <div className="step" data-reveal="up" style={d(1)}><b>2</b><h3>Choose your time</h3><p>Pick 5, 15 or 25 minutes and a focus area. The mission is sized to fit, not stretched.</p></div>
              <div className="step" data-reveal="up" style={d(2)}><b>3</b><h3>Get one mission</h3><p>You see a single task, why it fits today, and a clear finish line. Mark it complete and stop.</p></div>
            </div>
          </div>
        </section>

        <Journey />

        <section>
          <div className="wrap">
            <h2 data-reveal="up">Progress that helps you notice, not compare.</h2>
            <div className="three">
              <div className="tile y" data-reveal="up" style={d(0)}><h3>Manageable steps</h3><p>Every mission is small enough to start while you’re tired. Finishing one counts.</p></div>
              <div className="tile" data-reveal="up" style={d(1)}><h3>Your own pace</h3><p>No public rank and no countdowns. Dkoder never compares you with anyone else.</p></div>
              <div className="tile" data-reveal="up" style={d(2)}><h3>Signals you can use</h3><p>See which practice areas you’ve touched, how often you showed up, and how confident you felt.</p></div>
            </div>
            <p className="lead" data-reveal="up">Dkoder doesn’t promise offers or outcomes. It helps you keep going.</p>
          </div>
        </section>

        <section className="alt">
          <div className="wrap">
            <h2 data-reveal="up">Three ways to make progress.</h2>
            <p className="lead" data-reveal="up" style={d(1)}>
              Some days you want company, some days a nudge, some days quiet. These are illustrations of how support could work; no real mentors or communities are connected in this demo.
            </p>
            <div className="three">
              <div className="tile" data-reveal="up" style={d(0)}><span className="tag">Illustrative</span><h3>Peer study</h3><p>Pair up with a classmate on the same mission and compare how you each approached it.</p></div>
              <div className="tile" data-reveal="up" style={d(1)}><span className="tag">Illustrative</span><h3>Mentor guidance</h3><p>Bring one question and a finished mission to someone more experienced.</p></div>
              <div className="tile" data-reveal="up" style={d(2)}><span className="tag">Illustrative</span><h3>Solo practice</h3><p>Do your mission alone, at your hour, with nobody watching.</p></div>
            </div>
          </div>
        </section>

        <Faq />

        <div className="wrap">
          <div className="close" data-reveal="up">
            <h2>Ready for a small first step?</h2>
            <p>Choose how you feel, how long you have, and what to work on. It takes less than a minute.</p>
            <a className="btn" href="#checkin" onClick={focusCheckin}>Find my next step</a>
          </div>
        </div>
      </main>
      <footer>
        <div className="wrap">
          Dkoder is a frontend demo. It has no login, no backend and no real placement data. Missions are fictional examples, and progress is saved only in this browser. This is a student demo project.
        </div>
      </footer>
    </>
  )
}