import { ar, type ScreenId } from '~/content/strings'
import { usePreviewRole } from '~/shell/usePreviewRole'

/**
 * Placeholder screen for a nav destination whose feature screen is not built
 * in Stage 1 ("No feature screens yet"). Explicitly labelled as guidance-only:
 * it must never look like a finished product screen.
 */
export function NotBuiltScreen({ id }: { id: ScreenId }) {
  const role = usePreviewRole()

  return (
    <article
      className="app-card placeholder"
      aria-label={ar.placeholder.screens[id]}
    >
      <p className="app-shell__badge">{ar.placeholder.badge}</p>
      <h1>{ar.placeholder.screens[id]}</h1>
      <p className="placeholder__lead">
        {role === 'student'
          ? ar.placeholder.notBuiltYetStudent
          : ar.placeholder.notBuiltYetTeacher}
      </p>
      <dl className="placeholder__meta">
        <dt>{ar.placeholder.builtBy}</dt>
        <dd>{ar.placeholder.builtByScreen[id]}</dd>
      </dl>
    </article>
  )
}
