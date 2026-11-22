import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '~/api'
import { queryKeys } from '~/api/query-keys'
import {
  sessionQueryOptions,
  teacherQuestionBankQueryOptions,
} from '~/api/queries'
import type { Question, UserId } from '~/api/types'
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
import { EmptyBox, LoadingNote, PageHead, Panel, Status } from './ui'

/**
 * Part 2 (2026-11-22) — teacher question bank, rebuilt as a dense table.
 *
 * The bank is the composed `teacherQuestionBankQueryOptions` (tests + full
 * questions + unit names) through the adapter; filtering is presentation only.
 *
 * "Add to draft" is the one write here and it targets the newest draft test.
 * `questions.create` already accepts the authoring metadata, so the copy keeps
 * the prompt, options, type, difficulty, points, model answer and unit. When the
 * teacher has no draft the button is disabled with the reason beside it — no
 * invented destination.
 *
 * The demo's "new bank question" modal is deliberately absent: the contract has
 * no bank-level create, and `questions.create` requires a test id. Reported in
 * the delivery note rather than faked.
 */
export function QuestionBank() {
  const sessionQuery = useQuery(sessionQueryOptions())
  const guest = useGuestPreview()
  const copy = useStrings().questionBank
  const lang = useLang()
  const [classId, setClassId] = useState('all')
  const [query, setQuery] = useState('')
  const [addedQuestionId, setAddedQuestionId] = useState<string | null>(null)

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
  const rows = filtered.flatMap((group) =>
    group.questions.map((question) => ({ question, testId: group.test.id })),
  )

  return (
    <Frame title={copy.title}>
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
                        <div>{question.prompt}</div>
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
    </Frame>
  )
}

function Frame({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="tv-page">
      <PageHead title={title} />
      {children}
    </div>
  )
}