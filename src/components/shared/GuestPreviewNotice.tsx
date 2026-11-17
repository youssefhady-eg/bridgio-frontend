import { Link } from '@tanstack/react-router'
import { useGuestPreview } from '~/shell/useGuestPreview'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Shell-wide guest preview banner.
 *
 * Shown only when the visitor is a guest (no session) and the URL carries an
 * explicit `?as=` role. It names the state, names the demo role, and offers the
 * one honest exit: the sign-in screen. The preview never creates a session, so
 * actions that need one still fail or say they are unavailable.
 */
export function GuestPreviewNotice() {
  const { active, role } = useGuestPreview()
  const strings = useStrings()
  const lang = useLang()

  if (!active || !role) return null
  const copy = strings.guestPreview

  return (
    <section
      className="guest-preview"
      role="status"
      aria-label={`${copy.badge} — ${strings.auth.guestRoles[role]}. ${copy.body}`}
    >
      <span className="guest-preview__badge">{copy.badge}</span>
      <span className="guest-preview__role">{strings.auth.guestRoles[role]}</span>
      <p className="guest-preview__body">{copy.body}</p>
      <Link
        to="/sign-in"
        search={{ as: role, lang }}
        className="guest-preview__link"
        preload={false}
      >
        {copy.signIn}
      </Link>
    </section>
  )
}
