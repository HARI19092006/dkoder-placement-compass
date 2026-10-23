// Moves keyboard focus to the first check-in chip after a CTA scrolls there.
export function focusCheckin() {
  window.setTimeout(() => {
    document.querySelector<HTMLButtonElement>('#checkin .chip')?.focus({ preventScroll: true })
  }, 400)
}