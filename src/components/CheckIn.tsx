import type { Demo } from '../useDemo'
import Brush from './Brush'
import CheckInPanel from './CheckInPanel'
import MissionCard from './MissionCard'
import SectionReveal from './SectionReveal'
import { Sparkle } from './icons'

export default function CheckIn({ demo }: { demo: Demo }) {
  return (
    <section id="checkin" className="checkin" aria-labelledby="checkin-title">
      <div className="checkin-deco" aria-hidden="true">
        <span className="sphere sphere-ci-bl" />
        <span className="sphere sphere-ci-tr" />
        <span className="sphere sphere-ci-r" />
        <span className="sphere sphere-sm ci-sm-1" />
        <span className="sphere sphere-sm ci-sm-2" />
        <span className="orbit-arc ci-arc-1" />
        <span className="orbit-arc ci-arc-2" />
      </div>
      <div className="wrap">
        <SectionReveal className="sec-head">
          <h2 id="checkin-title" className="title-xl">
            Today’s <Brush>check-in</Brush>
            <Sparkle className="title-spark" />
          </h2>
          <p className="lead">Three questions, one mission. Change any answer and the suggestion updates straight away.</p>
        </SectionReveal>
        <div className="checkin-grid">
          <div>
            <CheckInPanel sel={demo.sel} onChange={demo.setChoice} />
            {demo.rec && (
              <a className="jump" href="#mc-heading">See your mission: {demo.rec.mission.title}</a>
            )}
          </div>
          <MissionCard demo={demo} />
        </div>
      </div>
    </section>
  )
}