import type { ReactNode } from 'react'

/**
 * A "label: value" pair rendered as two flex items with a token gap.
 *
 * The pair used to be one inline text run (`label:{' '}value`). In RTL the JSX
 * space collapses at the text-node boundary, so the label and the value touched.
 * Here the colon stays inside the label item — it reads as part of the label in
 * both directions — and the value is a separate item. Values that already carry
 * their own element (a date, a count, a link) pass through as children.
 */
export function MetaPair({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <span className="meta-pair">
      <span className="meta-pair__label">{label}:</span>
      <span className="meta-pair__value">{children}</span>
    </span>
  )
}