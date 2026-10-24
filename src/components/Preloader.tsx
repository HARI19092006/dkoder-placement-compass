import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform, type AnimationPlaybackControls } from 'motion/react'

const KEY = 'dkoder-intro-seen'

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    return
  }
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => !alreadySeen())
  const controls = useRef<AnimationPlaybackControls | null>(null)
  const done = useRef(onDone)
  done.current = onDone
  const count = useMotionValue(0)
  const label = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'))
  const needle = useTransform(count, [0, 100], [-150, 0])
  const bar = useTransform(count, [0, 100], [0, 1])

  useEffect(() => {
    if (!show || reduce) {
      setShow(false)
      done.current()
      return
    }
    document.documentElement.classList.add('is-intro')
    controls.current = animate(count, 100, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        markSeen()
        setShow(false)
      },
    })
    const skip = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') controls.current?.complete()
    }
    window.addEventListener('keydown', skip)
    return () => {
      controls.current?.stop()
      window.removeEventListener('keydown', skip)
    }
  }, [show, reduce, count])

  const finish = () => {
    document.documentElement.classList.remove('is-intro')
    done.current()
  }

  return (
    <AnimatePresence onExitComplete={finish}>
      {show && !reduce && (
        <motion.div
          className="intro"
          aria-hidden="true"
          onClick={() => controls.current?.complete()}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <svg className="intro-mark" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" className="intro-face" />
            <circle cx="60" cy="60" r="40" className="intro-orbit" />
            <circle cx="60" cy="20" r="6" className="intro-node on" />
            <circle cx="25.4" cy="80" r="5" className="intro-node" />
            <circle cx="94.6" cy="80" r="5" className="intro-node" />
            <motion.g style={{ rotate: needle }}>
              <path d="M60 22 L66 60 L54 60 Z" className="intro-needle" />
              <path d="M54 60 L66 60 L60 98 Z" className="intro-tail" />
            </motion.g>
            <circle cx="60" cy="60" r="5" className="intro-pin" />
          </svg>
          <motion.span className="intro-count">{label}</motion.span>
          <span className="intro-bar">
            <motion.i style={{ scaleX: bar }} />
          </span>
          <span className="intro-line">Finding your next step</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}