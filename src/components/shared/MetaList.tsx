import type { ReactNode } from 'react'

/**
 * Label/value list used across the frontend-finish screens. It reuses the
 * builder summary list styling, so a test, a class and a student all present
 * their metadata in the same way. Values come from the adapter or from the
 * central string file; nothing is computed here.
 */
export function MetaList({
  items,
  ariaLabel,
}: {
  items: readonly { label: string; value: ReactNode }[]
  ariaLabel?: string
}) {
  return (
    <dl className="summary-list" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <div key={`${item.label}:${index}`}>
          <dt>{item.label}</dt>
          <dd>
            <bdi>{item.value}</bdi>
          </dd>
        </div>
      ))}
    </dl>
  )
}
