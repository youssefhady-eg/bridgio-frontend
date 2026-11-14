import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState, type FormEvent, type ReactNode } from 'react'
import { api } from '~/api'
import type { AccountsResult } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Self-service account screens — PROPOSED and NOT connected in this build.
 *
 * Each form calls the matching PROPOSED `auth.*` method (sign-up, reset request,
 * reset completion). The adapter answers with the defined
 * `{ status: 'unavailable' }` result while the accounts backend is absent, and
 * the screen says exactly that; it never reports success, never creates a local
 * account and never claims an email was sent. If a future adapter returns
 * `{ status: 'accepted' }`, the same area renders the accepted note instead.
 */

function resultView(result: AccountsResult | undefined, copy: AuthCopy) {
  if (!result) return null
  return (
    <p className="finish-note" role="status">
      {result.status === 'accepted' ? copy.accepted : copy.unavailable}
    </p>
  )
}

type AuthCopy = ReturnType<typeof useStrings>['auth']

export function SignUpView() {
  const strings = useStrings()
  const copy = strings.auth
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () =>
      api.auth.signUp({ fullName: fullName.trim(), email: email.trim(), password }),
  })
  const result = resultView(mutation.data, copy)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    mutation.mutate()
  }

  return (
    <AccountFrame copy={copy.signUp}>
      <form className="account-form" onSubmit={submit}>
        <label className="field">
          <span className="field__label">{copy.signUp.nameLabel}</span>
          <input
            className="input"
            type="text"
            value={fullName}
            placeholder={copy.signUp.namePlaceholder}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            required
          />
        </label>
        <label className="field">
          <span className="field__label">{copy.emailLabel}</span>
          <input
            className="input"
            type="email"
            value={email}
            placeholder={copy.emailPlaceholder}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="field">
          <span className="field__label">{copy.passwordLabel}</span>
          <input
            className="input"
            type="password"
            value={password}
            placeholder={copy.passwordPlaceholder}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <div className="account-form__actions">
          <button
            type="submit"
            className="button button--primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? copy.signUp.submitting : copy.signUp.submit}
          </button>
        </div>
      </form>

      {result}

      {mutation.isError ? (
        <EmptyNote
          tone="error"
          title={copy.requestErrorTitle}
          body={copy.requestErrorBody}
        />
      ) : null}
    </AccountFrame>
  )
}

export function ForgotPasswordView() {
  const strings = useStrings()
  const copy = strings.auth
  const [email, setEmail] = useState('')

  const mutation = useMutation({
    mutationFn: () => api.auth.requestPasswordReset({ email: email.trim() }),
  })
  const result = resultView(mutation.data, copy)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    mutation.mutate()
  }

  return (
    <AccountFrame copy={copy.forgot}>
      <form className="account-form" onSubmit={submit}>
        <label className="field">
          <span className="field__label">{copy.emailLabel}</span>
          <input
            className="input"
            type="email"
            value={email}
            placeholder={copy.emailPlaceholder}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <div className="account-form__actions">
          <button
            type="submit"
            className="button button--primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? copy.forgot.submitting : copy.forgot.submit}
          </button>
        </div>
      </form>

      {result}

      {mutation.isError ? (
        <EmptyNote
          tone="error"
          title={copy.requestErrorTitle}
          body={copy.requestErrorBody}
        />
      ) : null}
    </AccountFrame>
  )
}

export function ResetPasswordView({ token }: { token: string }) {
  const strings = useStrings()
  const copy = strings.auth
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [mismatch, setMismatch] = useState(false)

  const mutation = useMutation({
    mutationFn: () =>
      api.auth.resetPassword({ token, password }),
  })
  const result = resultView(mutation.data, copy)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password !== confirmation) {
      setMismatch(true)
      return
    }
    setMismatch(false)
    mutation.mutate()
  }

  if (token.trim().length === 0) {
    return (
      <AccountFrame copy={copy.reset}>
        <EmptyNote
          icon="alert"
          title={copy.reset.missingTokenTitle}
          body={copy.reset.missingTokenBody}
        />
      </AccountFrame>
    )
  }

  return (
    <AccountFrame copy={copy.reset}>
      <form className="account-form" onSubmit={submit}>
        <label className="field">
          <span className="field__label">{copy.passwordLabel}</span>
          <input
            className="input"
            type="password"
            value={password}
            placeholder={copy.passwordPlaceholder}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <label className="field">
          <span className="field__label">{copy.reset.confirmLabel}</span>
          <input
            className="input"
            type="password"
            value={confirmation}
            placeholder={copy.passwordPlaceholder}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        {mismatch ? (
          <p className="finish-note" role="alert">
            {copy.reset.mismatch}
          </p>
        ) : null}
        <div className="account-form__actions">
          <button
            type="submit"
            className="button button--primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? copy.reset.submitting : copy.reset.submit}
          </button>
        </div>
      </form>

      {result}

      {mutation.isError ? (
        <EmptyNote
          tone="error"
          title={copy.requestErrorTitle}
          body={copy.requestErrorBody}
        />
      ) : null}
    </AccountFrame>
  )
}

function AccountFrame({
  copy,
  children,
}: {
  copy: { badge: string; title: string; lead: string }
  children: ReactNode
}) {
  const strings = useStrings()
  const role = usePreviewRole()
  const lang = useLang()

  return (
    <div className="dashboard">
      <Link
        to="/sign-in"
        search={{ as: role, lang }}
        className="page-back"
        preload={false}
      >
        {strings.auth.backToSignIn}
      </Link>
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />
      {children}
    </div>
  )
}
