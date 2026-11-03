import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { api } from '~/api'
import type { GroundingScope, MohsenAnswer, UserId } from '~/api/types'
import { GroundingList } from '~/components/builder/GroundingList'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { useStrings } from '~/shell/useStrings'
import { answerView } from '~/components/mohsen/answerView'

interface QAEntry {
  key: string
  question: string
  /** null while the adapter is still answering. */
  answer: MohsenAnswer | null
  failed: boolean
}

/**
 * Mohsen Q&A beside the player — hardened in Stage 5.
 *
 * The panel is a thin view over `mohsen.ask`: every result is passed through
 * `answerView`, so an answered result is only shown when it carries usable
 * grounding (the adapter supplies the label and excerpt) and anything
 * ungrounded becomes the honest refusal. The UI never invents an answer, and
 * the adapter never guesses.
 */
export function MohsenPanel({
  studentId,
  scope,
}: {
  studentId: UserId
  scope: GroundingScope
}) {
  const strings = useStrings().player.mohsen
  const [entries, setEntries] = useState<QAEntry[]>([])
  const [draft, setDraft] = useState('')

  const askMutation = useMutation({
    mutationFn: (input: { key: string; question: string }) =>
      api.mohsen.ask({
        question: input.question,
        askedBy: studentId,
        scope,
      }),
    onSuccess: (answer, input) => {
      setEntries((previous) =>
        previous.map((entry) =>
          entry.key === input.key ? { ...entry, answer } : entry,
        ),
      )
    },
    onError: (_error, input) => {
      setEntries((previous) =>
        previous.map((entry) =>
          entry.key === input.key ? { ...entry, failed: true } : entry,
        ),
      )
    },
  })

  function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const question = draft.trim()
    if (question.length === 0 || askMutation.isPending) return
    const key = `${question}|${entries.length}`
    setEntries((previous) => [
      ...previous,
      { key, question, answer: null, failed: false },
    ])
    setDraft('')
    askMutation.mutate({ key, question })
  }

  return (
    <aside className="mohsen-panel" aria-labelledby="mohsen-panel-heading">
      <header>
        <h2 id="mohsen-panel-heading">{strings.heading}</h2>
        <p className="builder-panel__lead">{strings.lead}</p>
      </header>

      <form className="mohsen-panel__form" onSubmit={ask}>
        <label className="field__label" htmlFor="mohsen-question">
          {strings.inputLabel}
        </label>
        <input
          id="mohsen-question"
          className="input"
          type="text"
          value={draft}
          placeholder={strings.placeholder}
          onChange={(event) => setDraft(event.target.value)}
        />
        <div className="builder-actions">
          <button
            type="submit"
            className="button button--secondary"
            disabled={askMutation.isPending || draft.trim().length === 0}
          >
            {askMutation.isPending ? strings.asking : strings.ask}
          </button>
        </div>
      </form>

      {entries.length === 0 ? (
        <EmptyNote icon="spark" title={strings.heading} body={strings.empty} />
      ) : (
        <ol className="mohsen-panel__thread" aria-live="polite">
          {entries.map((entry) => {
            const view =
              entry.answer === null
                ? null
                : answerView(entry.answer, strings.notGroundedFallback)
            return (
              <li className="mohsen-qa" key={entry.key}>
                <p className="mohsen-qa__label">{strings.questionLabel}</p>
                <p className="mohsen-qa__question">{entry.question}</p>

                {entry.failed ? (
                  <EmptyNote
                    tone="error"
                    title={strings.errorTitle}
                    body={strings.errorBody}
                  />
                ) : view === null ? (
                  <p className="mohsen-qa__answer" role="status">
                    {strings.asking}
                  </p>
                ) : view.status === 'answered' ? (
                  <>
                    <p className="mohsen-qa__label">{strings.answeredLabel}</p>
                    <p className="mohsen-qa__answer">{view.answer}</p>
                    <GroundingList
                      grounding={view.grounding}
                      label={strings.groundingLabel}
                    />
                  </>
                ) : (
                  <EmptyNote
                    icon="book"
                    title={strings.refusalLabel}
                    body={view.answer}
                  />
                )}
              </li>
            )
          })}
        </ol>
      )}
    </aside>
  )
}
