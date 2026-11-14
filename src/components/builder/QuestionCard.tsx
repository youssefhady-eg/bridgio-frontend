import { useState } from 'react'
import type { Question } from '~/api/types'
import { StatusChip } from '~/components/dashboard/StatusChip'
import { formatCount } from '~/components/dashboard/format'
import { MetaPair } from '~/components/shared/MetaPair'
import { useLang, useStrings } from '~/shell/useStrings'
import {
  correctIndexFor,
  questionDraftIssue,
  type QuestionDraft,
  type QuestionDraftIssue,
} from './builder'
import { GroundingList } from './GroundingList'

function draftFrom(question: Question): QuestionDraft {
  return {
    prompt: question.prompt,
    options: question.options.map((option) => option.text),
    correctIndex: correctIndexFor(question),
  }
}

/**
 * One question card. When `readOnly` is set (a published test) the static view
 * is shown with no edit or delete actions, because the backend refuses to edit a
 * published test. Otherwise editing is local UI state and saving/deleting go
 * through the adapter callbacks supplied by the review step.
 */
export function QuestionCard({
  question,
  onSave,
  onDelete,
  readOnly = false,
}: {
  question: Question
  onSave?: (draft: QuestionDraft) => Promise<boolean>
  onDelete?: () => Promise<boolean>
  readOnly?: boolean
}) {
  const builder = useStrings().builder
  const strings = builder.review
  const lang = useLang()
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [draft, setDraft] = useState<QuestionDraft>(() => draftFrom(question))
  const [issue, setIssue] = useState<QuestionDraftIssue | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const correctOption = question.options.find(
    (option) => option.id === question.correctOptionId,
  )

  function startEditing() {
    setDraft(draftFrom(question))
    setIssue(null)
    setConfirmingDelete(false)
    setEditing(true)
  }

  function cancelEditing() {
    setDraft(draftFrom(question))
    setIssue(null)
    setEditing(false)
  }

  async function save() {
    if (!onSave) return
    const nextIssue = questionDraftIssue(draft)
    setIssue(nextIssue)
    if (nextIssue) return

    setSaving(true)
    const saved = await onSave({
      prompt: draft.prompt.trim(),
      options: draft.options.map((option) => option.trim()),
      correctIndex: draft.correctIndex,
    })
    setSaving(false)
    if (saved) setEditing(false)
  }

  async function remove() {
    if (!onDelete) return
    setDeleting(true)
    const deleted = await onDelete()
    setDeleting(false)
    if (!deleted) setConfirmingDelete(false)
  }

  function removeOptionAt(index: number) {
    setDraft((current) => {
      const options = current.options.filter((_, position) => position !== index)
      let correctIndex = current.correctIndex
      if (correctIndex !== null) {
        if (correctIndex === index) correctIndex = null
        else if (correctIndex > index) correctIndex -= 1
      }
      return { ...current, options, correctIndex }
    })
  }

  return (
    <article className="question-card">
      <header className="question-card__head">
        <div className="question-card__identity">
          <p className="question-card__number">
            {strings.questionNumber(formatCount(question.order, lang))}
          </p>
          <StatusChip
            tone="neutral"
            icon={question.origin === 'mohsen' ? 'spark' : 'pencil'}
            label={
              question.origin === 'mohsen'
                ? strings.originMohsen
                : strings.originTeacher
            }
          />
        </div>
        {!readOnly && !editing ? (
          <div className="question-card__actions">
            <button
              type="button"
              className="button button--secondary button--small"
              onClick={startEditing}
            >
              {strings.edit}
            </button>
            {confirmingDelete ? null : (
              <button
                type="button"
                className="button button--danger button--small"
                onClick={() => setConfirmingDelete(true)}
              >
                {strings.delete}
              </button>
            )}
          </div>
        ) : null}
      </header>

      {editing ? (
        <form
          className="question-editor"
          onSubmit={(event) => {
            event.preventDefault()
            void save()
          }}
        >
          <div className="field">
            <label
              className="field__label"
              htmlFor={`question-prompt-${question.id}`}
            >
              {strings.promptLabel}
            </label>
            <textarea
              id={`question-prompt-${question.id}`}
              className="input textarea"
              rows={3}
              value={draft.prompt}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  prompt: event.target.value,
                }))
              }
            />
            {issue === 'prompt' ? (
              <p className="field__error">{strings.issuePrompt}</p>
            ) : null}
          </div>

          <fieldset className="field">
            <legend className="field__label">{strings.optionsLabel}</legend>
            <ul className="editor-options">
              {draft.options.map((option, index) => (
                <li className="editor-option" key={index}>
                  <label className="editor-option__correct">
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={draft.correctIndex === index}
                      onChange={() =>
                        setDraft((current) => ({
                          ...current,
                          correctIndex: index,
                        }))
                      }
                    />
                    <span className="visually-hidden">
                      {strings.correctLabel}
                    </span>
                  </label>
                  <input
                    className="input"
                    type="text"
                    value={option}
                    aria-label={strings.optionLabel(formatCount(index + 1, lang))}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        options: current.options.map((value, position) =>
                          position === index ? event.target.value : value,
                        ),
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="button button--ghost button--icon"
                    aria-label={strings.removeOption(formatCount(index + 1, lang))}
                    disabled={draft.options.length <= 2}
                    onClick={() => removeOptionAt(index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            {draft.options.length < 6 ? (
              <button
                type="button"
                className="button button--secondary button--small"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    options: [...current.options, ''],
                  }))
                }
              >
                {strings.addOption}
              </button>
            ) : null}
            {issue === 'options' ? (
              <p className="field__error">{strings.issueOptions}</p>
            ) : null}
            {issue === 'correct' ? (
              <p className="field__error">{strings.issueCorrect}</p>
            ) : null}
          </fieldset>

          <p className="field__hint">{strings.correctHint}</p>

          <div className="builder-actions builder-actions--split">
            <button
              type="button"
              className="button button--secondary"
              onClick={cancelEditing}
              disabled={saving}
            >
              {strings.cancel}
            </button>
            <button
              type="submit"
              className="button button--primary"
              disabled={saving}
            >
              {saving ? strings.saving : strings.save}
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3>{question.prompt}</h3>
          <ol className="question-card__options">
            {question.options.map((option, index) => (
              <li key={option.id}>
                <span className="option-letter" aria-hidden="true">
                  {formatCount(index + 1, lang)}
                </span>
                <span>{option.text}</span>
              </li>
            ))}
          </ol>
          <p className="question-card__correct">
            <MetaPair label={strings.correctLabel}>
              <strong>{correctOption?.text ?? strings.correctNone}</strong>
            </MetaPair>
          </p>
          <GroundingList
            grounding={question.grounding}
            label={strings.groundingLabel}
          />
          {confirmingDelete ? (
            <div className="delete-confirm" role="alert">
              <p>{strings.deleteConfirmPrompt}</p>
              <div className="builder-actions">
                <button
                  type="button"
                  className="button button--danger button--small"
                  disabled={deleting}
                  onClick={() => void remove()}
                >
                  {deleting ? strings.saving : strings.deleteConfirm}
                </button>
                <button
                  type="button"
                  className="button button--secondary button--small"
                  disabled={deleting}
                  onClick={() => setConfirmingDelete(false)}
                >
                  {strings.deleteCancel}
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </article>
  )
}
