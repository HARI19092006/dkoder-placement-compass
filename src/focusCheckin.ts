import { scrollToElement } from './smoothScroll'

export type CheckInGroup = 'mood' | 'focus' | 'time'

export function focusCheckin(group: CheckInGroup = 'mood', scroll = false) {
  const fieldset = document.getElementById(`q-${group}`)
  if (scroll && fieldset) scrollToElement(fieldset, 'center')
  window.setTimeout(() => {
    const input =
      document.querySelector<HTMLInputElement>(`#q-${group} input:checked`) ??
      document.querySelector<HTMLInputElement>(`#q-${group} input`)
    input?.focus({ preventScroll: true })
  }, scroll ? 450 : 400)
}