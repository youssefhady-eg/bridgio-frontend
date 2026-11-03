import { Icon, type IconName } from './icons'

/**
 * Status chip: icon + word, never colour alone (token sheet §1 / §6).
 * Tones reuse locked status colours only; no new hex is introduced.
 */
export type StatusTone = 'success' | 'warning' | 'neutral'

export function StatusChip({
  tone,
  label,
  icon,
}: {
  tone: StatusTone
  label: string
  icon: IconName
}) {
  return (
    <span className={`status-chip status-chip--${tone}`}>
      <Icon name={icon} size={14} />
      <span>{label}</span>
    </span>
  )
}
