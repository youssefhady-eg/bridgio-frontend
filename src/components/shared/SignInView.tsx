import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { api } from '~/api'
import { isApiError } from '~/api/errors'
import { sessionQueryOptions } from '~/api/queries'
import type { UserRole } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { PageHero } from '~/components/shared/PageHero'
import type { AppRole } from '~/shell/nav'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/** The four guest landings, in the order the sign-in screen offers them. */
const guestRoleOrder: readonly AppRole[] = [
  'teacher',
  'student',
  'parent',
  'assistant',
] as const

/**
 * Sign in — wired to the adapter.
 *
 * The form calls the PROPOSED `auth.signIn` through the adapter. In the mock
 * adapter the seeded accounts accept any non-empty password; in HTTP mode the
 * connected auth service answers. On success the user lands on the role home
 * for the role the backend returned, and the session query is refreshed. On
 * failure the adapter's own error message is shown, never an invented one.
 *
 * "Continue as a guest" opens a read-only preview, not an account: the visitor
 * picks one of the four roles, the mock session is cleared, and the matching
 * seeded demo identity is borrowed for reads through `?as=`. The preview is
 * labelled in the shell, creates no session and cannot write; signing in later
 * is the only exit that turns it into a real account.
 *
 * The two self-service links still open screens that state the accounts
 * backend is not connected; they never fake a result.
 */
export function SignInView() {
  const strings = useStrings()
  const copy = strings.auth
  const role = usePreviewRole()
  const lang = useLang()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signInMutation = useMutation({
    mutationFn: () =>
      api.auth.signIn({ email: email.trim(), password }),
    onSuccess: (session) => {
      queryClient.setQueryData(sessionQueryOptions().queryKey, session)
      void queryClient.invalidateQueries({
        queryKey: sessionQueryOptions().queryKey,
      })
      navigateToRoleHome(session.user.role)
    },
  })

  // Guest preview: clear the mock session, then land on the chosen role's
  // screen with `?as=<role>`. No credentials are sent and no account is
  // created; the adapter borrows the seeded demo identity for reads only.
  const guestMutation = useMutation({
    mutationFn: (nextRole: AppRole) => api.auth.signOut(),
    onSuccess: (_result, nextRole) => {
      queryClient.setQueryData(sessionQueryOptions().queryKey, null)
      void queryClient.invalidateQueries({
        queryKey: sessionQueryOptions().queryKey,
      })
      navigateToRoleHome(nextRole)
    },
  })

  function navigateToRoleHome(nextRole: UserRole) {
    switch (nextRole) {
      case 'student':
        void navigate({ to: '/student/home', search: { as: 'student', lang } })
        return
      case 'parent':
        void navigate({ to: '/parent/progress', search: { as: 'parent', lang } })
        return
      case 'assistant':
        void navigate({ to: '/assistant', search: { as: 'assistant', lang } })
        return
      case 'teacher':
        void navigate({
          to: '/teacher/dashboard',
          search: { as: 'teacher', lang },
        })
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (signInMutation.isPending) return
    signInMutation.mutate()
  }

  const errorMessage = signInMutation.isError
    ? isApiError(signInMutation.error)
      ? signInMutation.error.message
      : copy.requestErrorBody
    : null

  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />

      <form className="signin-form" onSubmit={submit}>
        <label className="field">
          <span className="field__label">{copy.emailLabel}</span>
          <input
            className="input"
            type="email"
            value={email}
            required
            placeholder={copy.emailPlaceholder}
            autoComplete="email"
            onChange={(event) => {
              setEmail(event.target.value)
              signInMutation.reset()
            }}
          />
        </label>
        <label className="field">
          <span className="field__label">{copy.passwordLabel}</span>
          <input
            className="input"
            type="password"
            value={password}
            required
            placeholder={copy.passwordPlaceholder}
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value)
              signInMutation.reset()
            }}
          />
        </label>
        <button
          type="submit"
          className="button button--primary signin-form__submit"
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? copy.signingIn : copy.submit}
        </button>
      </form>

      {errorMessage ? (
        <EmptyNote
          tone="error"
          title={copy.requestErrorTitle}
          body={errorMessage}
        />
      ) : null}

      <p className="field__hint signin-hint">{copy.signInHint}</p>

      <div className="signin-guest">
        <h2 className="signin-guest__heading" id="signin-guest-heading">
          {copy.guestLabel}
        </h2>
        <div
          className="signin-guest__roles"
          role="group"
          aria-labelledby="signin-guest-heading"
        >
          {guestRoleOrder.map((guestRole) => (
            <button
              key={guestRole}
              type="button"
              className="button button--secondary signin-guest__button"
              disabled={guestMutation.isPending}
              onClick={() => guestMutation.mutate(guestRole)}
            >
              {copy.guestRoles[guestRole]}
            </button>
          ))}
        </div>
        <p className="field__hint">{copy.guestHint}</p>
      </div>

      <nav className="auth-links" aria-label={copy.linksHeading}>
        <h2 className="auth-links__heading">{copy.linksHeading}</h2>
        <div className="auth-links__row">
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
        </div>
      </nav>
    </div>
  )
}