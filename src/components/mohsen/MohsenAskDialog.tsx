import { useMutation } from '@tanstack/react-query'
import {
  Dialog,
  Modal,
  ModalOverlay,
} from 'react-aria-components'
import { useEffect, useState, type FormEvent } from 'react'
import { api } from '~/api'
import type { GroundingScope, MohsenAnswer, UserId } from '~/api/types'
import { GroundingList } from '~/components/builder/GroundingList'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { answerView } from '~/components/mohsen/answerView'
import { useStrings } from '~/shell/useStrings'

interface QAEntry {
  key: string
  question: string
  /** null while the adapter is still answering. */
  answer: MohsenAnswer | null
  failed: boolean
}

/**
 * Global "ask Mohsen" popup — every screen, every signed-in role.
 *
 * Mohsen answers only from uploaded material and the fixed curriculum, so this
 * popup sends an empty scope: with no material or unit selected the adapter
 * either grounds the answer in the fixed curriculum or refuses. Every result is
 * normalised through `answerView`, so an answered result without usable
 * grounding is shown as the honest refusal rather than as an ungrounded answer.
 * No answer is invented anywhere in the UI.
 */
export function MohsenAskDialog({
  open,
  onClose,
  userId,
}: {
  open: boolean
  onClose: () => void
  userId: UserId
}) {
  const strings = useStrings().mohsenAsk
  const [entries, setEntries] = useState<QAEntry[]>([])
  const [draft, setDraft] = useState('')

  const scope: GroundingScope = {
    classroomId: null,
    testId: null,
    materialIds: [],
    unitId: null,
  }

  // First Escape closes the popup even while focus is in the question field.
  // The capture listener runs before react-aria's own dismissal handling, so
  // the key is never swallowed by the input.
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [open, onClose])

  const askMutation = useMutation({
    mutationFn: (input: { key: string; question: string }) =>
      api.mohsen.ask({ question: input.question, askedBy: userId, scope }),
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
    <ModalOverlay
      className="mohsen-ask"
      isOpen={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
      isDismissable
    >
      <Modal className="mohsen-ask__panel">
        <Dialog className="mohsen-ask__dialog" aria-label={strings.title}>
          <header className="mohsen-ask__head">
            <h2 className="mohsen-ask__title">{strings.title}</h2>
            <button
              type="button"
              className="mohsen-ask__close"
              onClick={onClose}
              aria-label={strings.closeLabel}
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <p className="mohsen-ask__lead">{strings.lead}</p>

          <form className="mohsen-ask__form" onSubmit={ask}>
            <label className="field__label" htmlFor="mohsen-ask-input">
              {strings.inputLabel}
            </label>
            <div className="mohsen-ask__composer">
              <input
                id="mohsen-ask-input"
                className="input"
                type="text"
                value={draft}
                placeholder={strings.placeholder}
                onChange={(event) => setDraft(event.target.value)}
                autoComplete="off"
                autoFocus
              />
              <button
                type="submit"
                className="button button--primary"
                disabled={askMutation.isPending || draft.trim().length === 0}
              >
                {askMutation.isPending ? strings.asking : strings.ask}
              </button>
            </div>
          </form>

          <div className="mohsen-ask__thread">
            {entries.length === 0 ? (
              <EmptyNote
                icon="spark"
                title={strings.emptyTitle}
                body={strings.empty}
              />
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
                      <p className="mohsen-qa__question" dir="auto">
                        {entry.question}
                      </p>

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
                          <p className="mohsen-qa__label">
                            {strings.answeredLabel}
                          </p>
                          <p className="mohsen-qa__answer" dir="auto">
                            {view.answer}
                          </p>
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
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
