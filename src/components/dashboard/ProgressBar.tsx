import { clampPercent } from './format'

/**
 * Progress bar for "Student progress at a glance".
 *
 * The width is the only data-driven inline style; the fill follows the inline
 * direction, so in RTL it grows from the right without a mirroring hack.
 * ARIA carries the exact number even when the visible label is abbreviated.
 */
export function ProgressBar({
  percent,
  label,
  valueText,
}: {
  percent: number
  label: string
  valueText: string
}) {
  const value = clampPercent(percent)
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={valueText}
    >
      <span className="progress__fill" style={{ width: `${value}%` }} />
    </div>
  )
}
