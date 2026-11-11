import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { PageHero } from '~/components/shared/PageHero'
import { useStrings } from '~/shell/useStrings'

/**
 * Sign in — informational only.
 *
 * BRIDGIO has no auth system; sign-in and roles are owned by Mentingo and the
 * transport is unconfirmed. So this screen does NOT call `auth.signIn` and does
 * NOT invent a flow: the fields are disabled, a note explains why, and the demo
 * session mechanism is described. When Mentingo auth lands, this screen becomes
 * the real entry point.
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

      <p className="finish-note">{copy.disabledNote}</p>

      <section className="dashboard__section">
        <EmptyNote icon="alert" title={copy.noteTitle} body={copy.note} />
      </section>

      <section className="dashboard__section">
        <h2>{copy.demoHeading}</h2>
        <p className="section-lead">{copy.demoLead}</p>
        <p className="finish-note">{copy.demoNote}</p>
      </section>
    </div>
  )
}
