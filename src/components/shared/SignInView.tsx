import { Link } from '@tanstack/react-router'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Sign in — informational only.
 *
 * The fields are disabled and one plain status line says sign-in is not
 * available yet. Nothing is invented here: no flow, no provider, no contact
 * detail. The two self-service links open screens that state the accounts
 * backend is not connected; they never fake a result.
 */
export function SignInView() {
  const strings = useStrings()
  const copy = strings.auth
  const role = usePreviewRole()
  const lang = useLang()

  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />

      <form className="signin-form" onSubmit={(event) => event.preventDefault()}>
        <label className="field">
          <span className="field__label">{copy.emailLabel}</span>
          <input
            className="input"
            type="email"
            placeholder={copy.emailPlaceholder}
            disabled
            autoComplete="off"
          />
        </label>
        <label className="field">
          <span className="field__label">{copy.passwordLabel}</span>
          <input
            className="input"
            type="password"
            placeholder={copy.passwordPlaceholder}
            disabled
            autoComplete="off"
          />
        </label>
        <button
          type="submit"
          className="button button--primary signin-form__submit"
          disabled
        >
          {copy.submit}
        </button>
      </form>

      <p className="finish-note" role="status">
        {copy.status}
      </p>

      <nav className="auth-links" aria-label={copy.linksHeading}>
        <h2 className="auth-links__heading">{copy.linksHeading}</h2>
        <Link
          to="/sign-up"
          search={{ as: role, lang }}
          className="auth-links__link"
          preload={false}
        >
          {copy.signUpLink}
        </Link>
        <Link
          to="/forgot-password"
          search={{ as: role, lang }}
          className="auth-links__link"
          preload={false}
        >
          {copy.forgotLink}
        </Link>
      </nav>
    </div>
  )
}