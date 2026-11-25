import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '~/api'
import { queryKeys } from '~/api/query-keys'
import {
  sessionQueryOptions,
  teacherQuestionBankQueryOptions,
} from '~/api/queries'
import type { CurriculumUnit, Question, UserId } from '~/api/types'
import { correctIndexFor } from '~/components/builder/builder'
import { formatCount } from '~/components/dashboard/format'
import { useGuestPreview } from '~/shell/useGuestPreview'
import { useLang, useStrings } from '~/shell/useStrings'
import {
  filterQuestionBank,
  newestDraft,
  questionBankClasses,
  questionBankTotals,
} from './question-bank'
import { difficultyTone } from './tones'
import {
  EmptyBox,
  LoadingNote,
  Modal,
  PageHead,
  Panel,
  Status,
} from './ui'

/**
 * Part 2 (2026-11-22) — teacher question bank, rebuilt as a dense table.
 *
 * The bank is the composed `teacherQuestionBankQueryOptions` (tests + full
 * questions + unit names) through the adapter; filtering is presentation only.
 *
 * "Add to draft" copies an existing question into the newest draft test, and
 * the "+ new question" modal creates one there directly. Both target the newest
 * draft: `questions.create` requires a test id and there is no bank-level create
 * endpoint. When the teacher has no draft the buttons are disabled with the
 * reason beside them — no invented destination, no fake success.
 *
 * The demo's "new bank question" modal is a `.br-modal` (max-width 560px). Its
 * fields are exactly `CreateQuestionInput`: prompt, options (2–6, or none for an
 * essay), correct option index or none, type, difficulty, points, model answer
 * and unit. The unit choices are the target draft's own units.
 */
export function QuestionBank() {
  const sessionQuery = useQuery(sessionQueryOptions())
  const guest = useGuestPreview()
  const copy = useStrings().questionBank
  const lang = useLang()
  const [classId, setClassId] = useState('all')
  const [query, setQuery] = useState('')
  const [addedQuestionId, setAddedQuestionId] = useState<string | null>(null)
  const [showNewQuestion, setShowNewQuestion] = useState(false)

  const sessionUser = sessionQuery.data?.user ?? guest.user
  const teacherId = sessionUser?.role === 'teacher' ? sessionUser.id : null

  const bankQuery = useQuery({
    ...teacherQuestionBankQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })

  const queryClient = useQueryClient()
  const addMutation = useMutation({
    mutationFn: (input: { question: Question; testId: string }) =>
      api.questions.create({
        teacherId: teacherId ?? '',
        testId: input.testId,
        prompt: input.question.prompt,
        options:
          input.question.type === 'essay'
            ? []
            : input.question.options.map((option) => option.text),
        correctOptionIndex:
          input.question.type === 'essay'
            ? null
            : correctIndexFor(input.question),
        type: input.question.type,
        difficulty: input.question.difficulty,
        points: input.question.points,
        modelAnswer: input.question.modelAnswer,
        unitId: input.question.unitId,
      }),
    onSuccess: (created, input) => {
      setAddedQuestionId(created.id)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.questions.forTeacher(teacherId ?? ''),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.questions(input.testId),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.detail(input.testId),
      })
    },
    onMutate: () => setAddedQuestionId(null),
  })

  if (sessionQuery.isPending || (teacherId !== null && bankQuery.isPending)) {
    return (
      <Frame title={copy.title}>
        <LoadingNote>{copy.loading}</LoadingNote>
      </Frame>
    )
  }

  if (teacherId === null) {
    return (
      <Frame title={copy.title}>
        <EmptyBox title={copy.noSessionTitle} body={copy.noSessionBody} />
      </Frame>
    )
  }

  if (bankQuery.isError || !bankQuery.data) {
    return (
      <Frame title={copy.title}>
        <EmptyBox
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  const groups = bankQuery.data.groups
  const unitsById = bankQuery.data.unitsById
  const classes = questionBankClasses(groups)
  const totals = questionBankTotals(groups)
  const filtered = filterQuestionBank(groups, {
    classroomId: classId === 'all' ? null : classId,
    query,
  })
  const draft = newestDraft(groups)
  const draftUnits =
    draft === null
      ? []
      : (bankQuery.data.unitsByClass[draft.test.classroomId] ?? [])
  const rows = filtered.flatMap((group) =>
    group.questions.map((question) => ({ question, testId: group.test.id })),
  )

  return (
    <Frame
      title={copy.title}
      actions={
        <button
          type="button"
          className="tv-btn tv-btn-primary"
          disabled={draft === null}
          title={draft === null ? copy.noDraftHint : undefined}
          onClick={() => setShowNewQuestion(true)}
        >
          {copy.newQuestion}
        </button>
      }
    >
      <Panel>
        <div className="tv-panel-head">
          <div className="tv-page-actions">
            <input
              className="tv-input"
              type="search"
              aria-label={copy.searchLabel}
              placeholder={copy.searchPlaceholder}
              style={{ width: '240px' }}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {classes.length > 0 ? (
              <select
                className="tv-select"
                aria-label={copy.filterClass}
                value={classId}
                onChange={(event) => setClassId(event.target.value)}
              >
                <option value="all">{copy.allClasses}</option>
                {classes.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            ) : null}
            {classId !== 'all' || query !== '' ? (
              <button
                type="button"
                className="tv-btn tv-btn-ghost tv-btn-sm"
                onClick={() => {
                  setClassId('all')
                  setQuery('')
                }}
              >
                {copy.clearFilters}
              </button>
            ) : null}
          </div>
          <span className="tv-cell-sub">
            {draft
              ? copy.targetDraft(draft.test.title)
              : copy.noDraftHint}
          </span>
        </div>

        {rows.length === 0 ? (
          <EmptyBox
            title={
              groups.length === 0
                ? copy.emptyTitle
                : totals.questions === 0
                  ? copy.noQuestionsTitle
                  : copy.noMatchTitle
            }
            body={
              groups.length === 0
                ? copy.emptyBody
                : totals.questions === 0
                  ? copy.noQuestionsBody
                  : copy.noMatchBody
            }
          />
        ) : (
          <div className="tv-table-wrap">
            <table className="tv-table">
              <caption className="visually-hidden">{copy.readOnlyNote}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.colQuestion}</th>
                  <th scope="col">{copy.colUnit}</th>
                  <th scope="col">{copy.colType}</th>
                  <th scope="col">{copy.colDifficulty}</th>
                  <th scope="col">{copy.colPoints}</th>
                  <th scope="col">{copy.colAction}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ question, testId }) => {
                  const unitId = question.unitId
                  // A question already owned by the newest draft cannot be added
                  // to it again; the button says so instead of duplicating it.
                  const inDraft = draft !== null && testId === draft.test.id
                  const added = addedQuestionId === question.id
                  return (
                    <tr key={question.id}>
                      <td className="tv-td-primary">
                        <div className="tv-cell-title">{question.prompt}</div>
                        {question.modelAnswer ? (
                          <details className="tv-cell-sub">
                            <summary style={{ cursor: 'pointer' }}>
                              {copy.modelAnswer}
                            </summary>
                            <div style={{ marginTop: '4px' }}>
                              {question.modelAnswer}
                            </div>
                          </details>
                        ) : null}
                      </td>
                      <td data-label={copy.colUnit} className="tv-cell-sub">
                        {unitId === null
                          ? copy.noUnit
                          : (unitsById[unitId] ?? copy.noUnit)}
                      </td>
                      <td data-label={copy.colType}>
                        {question.type === 'essay'
                          ? copy.typeEssay
                          : copy.typeMcq}
                      </td>
                      <td data-label={copy.colDifficulty}>
                        <Status tone={difficultyTone(question.difficulty)}>
                          {question.difficulty === 'easy'
                            ? copy.difficultyEasy
                            : question.difficulty === 'medium'
                              ? copy.difficultyMedium
                              : copy.difficultyHard}
                        </Status>
                      </td>
                      <td data-label={copy.colPoints} className="tv-num">
                        {formatCount(question.points, lang)}
                      </td>
                      <td data-label={copy.colAction}>
                        <div className="tv-actions-cell">
                          <button
                            type="button"
                            className="tv-btn tv-btn-subtle tv-btn-sm"
                            disabled={
                              draft === null || inDraft || addMutation.isPending
                            }
                            title={
                              draft === null
                                ? copy.noDraftHint
                                : inDraft
                                  ? copy.inDraftHint
                                  : undefined
                            }
                            onClick={() => {
                              if (!draft || inDraft) return
                              addMutation.mutate({
                                question,
                                testId: draft.test.id,
                              })
                            }}
                          >
                            {inDraft ? copy.inDraft : copy.addToDraft}
                          </button>
                        </div>
                        {addMutation.isError && addMutation.variables?.question.id === question.id ? (
                          <div className="tv-inline-error" role="alert">
                            {copy.addErrorTitle}
                          </div>
                        ) : null}
                        {added && draft ? (
                          <div className="tv-cell-sub" role="status">
                            {copy.addedNote(draft.test.title)}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {showNewQuestion && draft ? (
        <NewQuestionModal
          teacherId={teacherId}
          draft={draft}
          units={draftUnits}
          onCreated={(question) => {
            setAddedQuestionId(question.id)
            setShowNewQuestion(false)
          }}
          onClose={() => setShowNewQuestion(false)}
        />
      ) : null}
    </Frame>
  )
}

/**
 * The "+ new question" modal. It writes with `questions.create` into the newest
 * draft, carrying the full `CreateQuestionInput`. The submit button is disabled
 * until the prompt and (for an MCQ) 2–6 unique options are present, so the
 * adapter's validation is never reachable from the happy path.
 */
function NewQuestionModal({
  teacherId,
  draft,
  units,
  onCreated,
  onClose,
}: {
  teacherId: UserId
  draft: NonNullable<ReturnType<typeof newestDraft>>
  units: readonly CurriculumUnit[]
  onCreated: (question: Question) => void
  onClose: () => void
}) {
  const copy = useStrings().questionBank
  const queryClient = useQueryClient()
  const [type, setType] = useState<'mcq' | 'essay'>('mcq')
  const [prompt, setPrompt] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [correctIndex, setCorrectIndex] = useState<number | null>(null)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'medium',
  )
  const [points, setPoints] = useState('2')
  const [modelAnswer, setModelAnswer] = useState('')
  const [unitId, setUnitId] = useState('')

  const trimmedOptions = options.map((option) => option.trim())
  const optionsValid =
    type === 'essay' ||
    (trimmedOptions.length >= 2 &&
      trimmedOptions.length <= 6 &&
      trimmedOptions.every((option) => option !== '') &&
      new Set(trimmedOptions.map((option) => option.toLowerCase())).size ===
        trimmedOptions.length)
  const pointsValue = Number(points)
  const pointsValid = Number.isInteger(pointsValue) && pointsValue >= 1
  const canSubmit = prompt.trim() !== '' && optionsValid && pointsValid

  const createMutation = useMutation({
    mutationFn: () =>
      api.questions.create({
        teacherId,
        testId: draft.test.id,
        prompt: prompt.trim(),
        options: type === 'essay' ? [] : trimmedOptions,
        correctOptionIndex: type === 'essay' ? null : correctIndex,
        type,
        difficulty,
        points: pointsValue,
        modelAnswer: modelAnswer.trim() === '' ? null : modelAnswer.trim(),
        unitId: unitId === '' ? null : unitId,
      }),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.questions.forTeacher(teacherId),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.questions(draft.test.id),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.detail(draft.test.id),
      })
      onCreated(created)
    },
  })

  return (
    <Modal
      title={copy.newQuestionModalTitle}
      closeLabel={copy.close}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="tv-btn tv-btn-secondary tv-btn-sm"
            onClick={onClose}
          >
            {copy.cancel}
          </button>
          <button
            type="submit"
            form="tv-new-question"
            className="tv-btn tv-btn-primary tv-btn-sm"
            disabled={!canSubmit || createMutation.isPending}
          >
            {createMutation.isPending ? copy.saving : copy.save}
          </button>
        </>
      }
    >
      <form
        id="tv-new-question"
        className="tv-stack-sm"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSubmit) createMutation.mutate()
        }}
      >
        <label className="tv-field">
          <span className="tv-label">{copy.promptLabel}</span>
          <textarea
            className="tv-textarea"
            rows={3}
            required
            value={prompt}
            placeholder={copy.promptPlaceholder}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </label>

        <div className="tv-grid-equal">
          <label className="tv-field">
            <span className="tv-label">{copy.colType}</span>
            <select
              className="tv-select"
              value={type}
              onChange={(event) =>
                setType(event.target.value === 'essay' ? 'essay' : 'mcq')
              }
            >
              <option value="mcq">{copy.typeMcq}</option>
              <option value="essay">{copy.typeEssay}</option>
            </select>
          </label>
          <label className="tv-field">
            <span className="tv-label">{copy.colDifficulty}</span>
            <select
              className="tv-select"
              value={difficulty}
              onChange={(event) =>
                setDifficulty(
                  event.target.value === 'easy'
                    ? 'easy'
                    : event.target.value === 'hard'
                      ? 'hard'
                      : 'medium',
                )
              }
            >
              <option value="easy">{copy.difficultyEasy}</option>
              <option value="medium">{copy.difficultyMedium}</option>
              <option value="hard">{copy.difficultyHard}</option>
            </select>
          </label>
        </div>

        <div className="tv-grid-equal">
          <label className="tv-field">
            <span className="tv-label">{copy.colUnit}</span>
            <select
              className="tv-select"
              value={unitId}
              onChange={(event) => setUnitId(event.target.value)}
            >
              <option value="">{copy.noUnitOption}</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.title}
                </option>
              ))}
            </select>
          </label>
          <label className="tv-field">
            <span className="tv-label">{copy.colPoints}</span>
            <input
              className="tv-input tv-num"
              type="number"
              min={1}
              max={20}
              value={points}
              onChange={(event) => setPoints(event.target.value)}
            />
          </label>
        </div>

        {type === 'mcq' ? (
          <fieldset className="tv-fieldset">
            <legend className="tv-label">{copy.optionsLabel}</legend>
            <label className="tv-field-inline">
              <input
                type="radio"
                name="tv-new-question-correct"
                checked={correctIndex === null}
                onChange={() => setCorrectIndex(null)}
              />
              {copy.correctNone}
            </label>
            {options.map((option, index) => (
              <div className="tv-option-row" key={index}>
                <input
                  type="radio"
                  name="tv-new-question-correct"
                  checked={correctIndex === index}
                  onChange={() => setCorrectIndex(index)}
                  aria-label={copy.correctOptionFor(index + 1)}
                />
                <input
                  className="tv-input"
                  type="text"
                  value={option}
                  placeholder={copy.optionPlaceholder}
                  onChange={(event) =>
                    setOptions(
                      options.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item,
                      ),
                    )
                  }
                />
                {options.length > 2 ? (
                  <button
                    type="button"
                    className="tv-btn tv-btn-ghost tv-btn-icon tv-btn-sm"
                    aria-label={copy.removeOption}
                    onClick={() => {
                      setOptions(options.filter((_, itemIndex) => itemIndex !== index))
                      setCorrectIndex((current) => {
                        if (current === null) return null
                        if (current === index) return null
                        return current > index ? current - 1 : current
                      })
                    }}
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            ))}
            <button
              type="button"
              className="tv-btn tv-btn-subtle tv-btn-sm"
              disabled={options.length >= 6}
              onClick={() => setOptions([...options, ''])}
            >
              {copy.addOption}
            </button>
          </fieldset>
        ) : null}

        <label className="tv-field">
          <span className="tv-label">{copy.modelAnswerLabel}</span>
          <input
            className="tv-input"
            type="text"
            value={modelAnswer}
            placeholder={copy.modelAnswerPlaceholder}
            onChange={(event) => setModelAnswer(event.target.value)}
          />
        </label>

        {createMutation.isError ? (
          <EmptyBox
            tone="error"
            title={copy.createErrorTitle}
            body={copy.createErrorBody}
          />
        ) : null}
      </form>
    </Modal>
  )
}

function Frame({
  title,
  actions,
  children,
}: {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="tv-page">
      <PageHead title={title}>{actions}</PageHead>
      {children}
    </div>
  )
}
