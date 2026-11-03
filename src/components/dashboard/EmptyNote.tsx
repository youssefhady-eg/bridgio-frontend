import { Icon, type IconName } from './icons'

/**
 * Empty / error note: icon + word, never colour alone.
 *
 * Token sheet §5 names a Mohsen "wakes up" pose for empty states; the reactions
 * sheet is not part of this stage's files (LIVE_RULES §7 assigns it to Stage 5),
 * so Stage 2 uses a neutral icon and leaves the pose for Stage 5.
 */
export function EmptyNote({
  title,
  body,
  icon = 'spark',
  tone = 'neutral',
}: {
  title: string
  body: string
  icon?: IconName
  tone?: 'neutral' | 'error'
}) {
  return (
    <div
      className={`empty-note${tone === 'error' ? ' empty-note--error' : ''}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <span className="empty-note__icon" aria-hidden="true">
        <Icon name={tone === 'error' ? 'alert' : icon} size={22} />
      </span>
      <div className="empty-note__text">
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  )
}
