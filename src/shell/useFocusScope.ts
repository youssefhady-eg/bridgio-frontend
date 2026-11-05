import { useEffect, useRef, type RefObject } from 'react'

/**
 * Focus handling for overlays (the mobile navigation drawer and the chat
 * dialog): while `open`, move focus inside, keep Tab inside, close on Escape,
 * and give focus back to whatever opened the overlay.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Index Tab should land on, wrapping at both ends. `current` is -1 outside. */
export function wrapFocusIndex(
  current: number,
  count: number,
  backwards: boolean,
): number {
  if (count <= 0) return -1
  if (current < 0) return backwards ? count - 1 : 0
  const next = current + (backwards ? -1 : 1)
  return (next + count) % count
}

function focusableWithin(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => element.getClientRects().length > 0,
  )
}

export function useFocusScope(
  open: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  // Callers pass inline handlers; keep the latest one without re-running the
  // effect (which would steal focus back on every parent render).
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const container = containerRef.current
    if (!container) return
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const first = focusableWithin(container)[0]
    if (first) first.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusableWithin(container)
      if (items.length === 0) return
      const index = wrapFocusIndex(
        items.indexOf(document.activeElement as HTMLElement),
        items.length,
        event.shiftKey,
      )
      const atEdge = event.shiftKey
        ? index === items.length - 1 || document.activeElement === items[0]
        : index === 0 || document.activeElement === items[items.length - 1]
      if (atEdge || !container.contains(document.activeElement)) {
        event.preventDefault()
        items[index]?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (opener?.isConnected) opener.focus()
    }
  }, [open, containerRef])
}
