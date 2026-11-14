import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * Design-system wrapper for a native `<select class="input">`.
 *
 * The browser arrow is removed (`appearance: none` in app.css) and replaced by
 * the Lucide chevron pinned to the inline-end side, so it sits on the correct
 * side in both directions and the text keeps a matching inline-end padding.
 * The `<select>` keeps its own options, value and change handler; only the
 * indicator changes.
 */
export function SelectField({ children }: { children: ReactNode }) {
  return (
    <span className="select-field">
      {children}
      <ChevronDown
        className="select-field__chevron"
        size={16}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </span>
  )
}