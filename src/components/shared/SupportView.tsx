import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { api } from '~/api'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { PageHero } from '~/components/shared/PageHero'
import { useStrings } from '~/shell/useStrings'

/**
 * Support request — interface only.
 *
 * The form is real: it validates locally, calls the PROPOSED
 * `support.submitRequest` method through the adapter, and shows a pending
 * state while the call runs. The support backend does not exist in this build,
 * so the mock returns `{ status: 'unavailable' }` and the screen says exactly
 * that: nothing was sent, no contact channel is invented, and replies arrive
 * only once the real backend is connected. No fake success is shown.
 */
export function SupportView() {
  const copy = useStrings().support
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const submitMutation = useMutation({
    mutationFn: () =>
      api.support.submitRequest({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      }),
  })

  const canSubmit =
    name.trim() !== '' &&
    email.trim() !== '' &&
    subject.trim() !== '' &&
    message.trim() !== ''
  const result = submitMutation.data

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit || submitMutation.isPending) return
    submitMutation.mutate()
  }

  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />

      <p className="support-note">{copy.note}</p>

      <form
        className="support-form"
        aria-label={copy.formLabel}
        aria-busy={submitMutation.isPending}
        onSubmit={submit}
      >
        <label className="field">
          <span className="field__label">{copy.nameLabel}</span>
          <input
            className="input"
            type="text"
            value={name}
            required
            placeholder={copy.namePlaceholder}
            autoComplete="name"
            onChange={(event) => {
              setName(event.target.value)
              submitMutation.reset()
            }}
          />
        </label>

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
              submitMutation.reset()
            }}
          />
        </label>

        <label className="field">
          <span className="field__label">{copy.subjectLabel}</span>
          <input
            className="input"
            type="text"
            value={subject}
            required
            placeholder={copy.subjectPlaceholder}
            onChange={(event) => {
              setSubject(event.target.value)
              submitMutation.reset()
            }}
          />
        </label>

        <label className="field">
          <span className="field__label">{copy.messageLabel}</span>
          <textarea
            className="input textarea"
            rows={6}
            value={message}
            required
            placeholder={copy.messagePlaceholder}
            onChange={(event) => {
              setMessage(event.target.value)
              submitMutation.reset()
            }}
          />
        </label>

        <div className="builder-actions">
          <button
            type="submit"
            className="button button--primary"
            disabled={!canSubmit || submitMutation.isPending}
          >
            {submitMutation.isPending ? copy.submitting : copy.submit}
          </button>
        </div>
      </form>

      <div className="support-form__status" aria-live="polite">
        {submitMutation.isError ? (
          <EmptyNote
            tone="error"
            title={copy.errorTitle}
            body={copy.errorBody}
          />
        ) : result?.status === 'unavailable' ? (
          <EmptyNote
            icon="alert"
            title={copy.unavailableTitle}
            body={copy.unavailableBody}
          />
        ) : result?.status === 'accepted' ? (
          <EmptyNote
            tone="success"
            icon="check"
            title={copy.acceptedTitle}
            body={copy.acceptedBody}
          />
        ) : null}
      </div>
    </div>
  )
}