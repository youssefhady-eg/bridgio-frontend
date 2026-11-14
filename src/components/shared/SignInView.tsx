import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { api } from '~/api'
import { isApiError } from '~/api/errors'
import { sessionQueryOptions } from '~/api/queries'
import type { UserRole } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Sign in — wired to the adapter.
 *
 * The form calls the PROPOSED `auth.signIn` through the adapter. In the mock
 * adapter the seeded accounts accept any non-empty password; in HTTP mode the
 * connected auth service answers. On success the user lands on the role home
 * for the role the backend returned, and the session query is refreshed. On
 * failure the adapter's own error message is shown, never an invented one.
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

      <p className="field__hint">{copy.signInHint}</p>

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