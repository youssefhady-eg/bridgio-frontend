import { Icon, type IconName } from './icons'

/**
 * Empty / error / success note: icon + word, never colour alone (token sheet
 * §1 / §5). Tones reuse the locked status colours only — no new hex value.
 *
 * Token sheet §5 names a Mohsen "wakes up" pose for empty states; the reactions
 * sheet is not part of the repo, so a neutral inline icon stands in and the
 * pose remains a pending owner asset (see the Stage 5 delivery note).
 */
export type EmptyNoteTone = 'neutral' | 'error' | 'success'

const toneIcons: Record<EmptyNoteTone, IconName> = {
  neutral: 'spark',
  error: 'alert',
  success: 'check',
}

export function EmptyNote({
  title,
  body,
  icon,
  tone = 'neutral',
}: {
  title: string
  body: string
  icon?: IconName
  tone?: EmptyNoteTone
}) {
  return (
    <div
      className={`empty-note empty-note--${tone}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <span className="empty-note__icon" aria-hidden="true">
        <Icon name={icon ?? toneIcons[tone]} size={22} />
      </span>
      <div className="empty-note__text">
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  )
}
