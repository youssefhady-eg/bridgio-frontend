import { PageHero } from '~/components/shared/PageHero'
import { useStrings } from '~/shell/useStrings'

/**
 * Sign in — informational only.
 *
 * The fields are disabled and one plain status line says sign-in is not
 * available yet. Nothing is invented here: no flow, no provider, no contact
 * detail.
 */
export function SignInView() {
  const strings = useStrings()
  const copy = strings.auth

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
    </div>
  )
}