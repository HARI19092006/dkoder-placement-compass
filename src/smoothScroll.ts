import Lenis from 'lenis'

let lenis: Lenis | null = null

const HEADER_SPACE = 104

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const rectTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY

export function docTop(el: Element): number {
  const panel = el.closest<HTMLElement>('.panel')
  if (!panel || !(el instanceof HTMLElement)) return rectTop(el)
  const prev = panel.previousElementSibling
  const base = prev && prev.classList.contains('panel-mark') ? rectTop(prev) : panel.parentElement ? rectTop(panel.parentElement) : null
  if (base === null) return rectTop(el)
  let node: HTMLElement = el
  let offset = 0
  while (node !== panel) {
    offset += node.offsetTop
    const parent: Element | null = node.offsetParent
    if (!(parent instanceof HTMLElement) || !(parent === panel || panel.contains(parent))) return rectTop(el)
    node = parent
  }
  return base + offset
}

export function scrollToY(y: number) {
  const top = Math.max(0, Math.round(y))
  if (lenis) {
    const distance = Math.abs(top - window.scrollY)
    lenis.scrollTo(top, { duration: Math.min(1.8, 0.7 + distance / 5000) })
    return
  }
  window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' })
}

export function scrollToElement(el: Element, block: 'start' | 'center' = 'start') {
  const top = docTop(el)
  const startY = top - HEADER_SPACE
  if (block === 'start') {
    scrollToY(startY)
    return
  }
  const h = el instanceof HTMLElement ? el.offsetHeight : 0
  scrollToY(Math.min(startY, top - (window.innerHeight - h) / 2))
}

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]'

function onAnchorClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href^="#"]') : null
  if (!a) return
  const id = decodeURIComponent((a.getAttribute('href') ?? '').slice(1))
  const target = id ? document.getElementById(id) : null
  if (!target) return
  e.preventDefault()
  if (id === 'top') scrollToY(0)
  else scrollToElement(target)
  if (!target.matches(FOCUSABLE)) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}

export function startSmoothScroll(): () => void {
  document.addEventListener('click', onAnchorClick)
  if (reducedMotion()) return () => document.removeEventListener('click', onAnchorClick)

const instance = new Lenis({ autoRaf: true, lerp: 0.14 })
  lenis = instance
  const root = document.documentElement
  let intro = root.classList.contains('is-intro')
  if (intro) instance.stop()
  const watch = new MutationObserver(() => {
    const now = root.classList.contains('is-intro')
    if (now === intro) return
    intro = now
    if (now) instance.stop()
    else instance.start()
  })
  watch.observe(root, { attributes: true, attributeFilter: ['class'] })

  return () => {
    watch.disconnect()
    instance.destroy()
    if (lenis === instance) lenis = null
    document.removeEventListener('click', onAnchorClick)
  }
}