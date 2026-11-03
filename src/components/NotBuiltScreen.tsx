import { type ScreenId } from '~/content/strings'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useStrings } from '~/shell/useStrings'

/**
 * Placeholder screen for a nav destination whose feature screen is not built
 * yet. Explicitly labelled as guidance-only: it must never look like a
 * finished product screen.
 */
export function NotBuiltScreen({ id }: { id: ScreenId }) {
  const role = usePreviewRole()
  const strings = useStrings()
  const copy = strings.placeholder

  return (
    <article className="app-card placeholder" aria-label={copy.screens[id]}>
      <p className="app-shell__badge">{copy.badge}</p>
      <h1>{copy.screens[id]}</h1>
      <p className="placeholder__lead">
        {role === 'student' ? copy.notBuiltYetStudent : copy.notBuiltYetTeacher}
      </p>
      <dl className="placeholder__meta">
        <dt>{copy.builtBy}</dt>
        <dd>{copy.builtByScreen[id]}</dd>
      </dl>
    </article>
  )
}
