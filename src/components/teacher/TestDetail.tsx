import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { api } from '~/api'
import { queryKeys } from '~/api/query-keys'
import {
  sessionQueryOptions,
  testAttemptsQueryOptions,
  testQueryOptions,
  testQuestionsQueryOptions,
} from '~/api/queries'
import type { Question, Test, UserId } from '~/api/types'
import { isApiError } from '~/api/errors'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip } from '~/components/dashboard/StatusChip'
import {
  formatCount,
  formatDate,
  formatPercent,
} from '~/components/dashboard/format'
import { QuestionCard } from '~/components/builder/QuestionCard'
import { removeQuestion, replaceQuestion, type QuestionDraft } from '~/components/builder/builder'
import { MetaList } from '~/components/shared/MetaList'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Teacher test detail — one test's metadata, questions and publishing state.
 *
 * A draft can be edited (title/description via `tests.update`, questions via
 * `questions.update` / `questions.delete`) and published via `tests.publish`. A
 * published test is read-only, because the mock refuses to edit a published
 * test; the read-only state is stated, not hidden.
 *
 * Per-test results come from `attempts.listForTest`, a PROPOSED Batch 2 method
 * of the contract. The scores it returns are backend-supplied: this screen
 * renders them as given and never marks an answer or computes a score.
 */
export function TestDetail({ testId }: { testId: string }) {
  const strings = useStrings()
  const copy = strings.testDetail
  const lang = useLang()

  const sessionQuery = useQuery(sessionQueryOptions())
  const teacherId =
    sessionQuery.data?.user.role === 'teacher'
      ? sessionQuery.data.user.id
      : null

  const testQuery = useQuery(testQueryOptions(testId))
  const questionsQuery = useQuery({
    ...testQuestionsQueryOptions(testId),
    enabled: teacherId !== null,
  })

  if (testQuery.isPending) {
    return (
      <Frame title={strings.nav['teacher-tests']}>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (testQuery.isError || !testQuery.data) {
    const notFound =
      isApiError(testQuery.error) && testQuery.error.code === 'NOT_FOUND'
    return (
      <Frame title={strings.nav['teacher-tests']}>
        <EmptyNote
          tone={notFound ? 'neutral' : 'error'}
          icon={notFound ? 'alert' : undefined}
          title={notFound ? copy.notFoundTitle : copy.loadErrorTitle}
          body={notFound ? copy.notFoundBody : copy.loadErrorBody}
        />
      </Frame>
    )
  }

  const test = testQuery.data
  const published = test.status === 'published'
  const questions = questionsQuery.data ?? []

  return (
    <Frame
      title={test.title}
      greeting={
        <div className="finish-row">
          <StatusChip
            tone={published ? 'success' : 'warning'}
            icon={published ? 'check' : 'pencil'}
            label={published ? copy.statusPublished : copy.statusDraft}
          />
          <span className="row-meta">{test.classroomName}</span>
        </div>
      }
    >
      {/* The class already sits next to the status chip in the hero, so it is
          not repeated here. One date row: the publish date once published, the
          last-edit date while the test is still a draft. */}
      <MetaList
        items={[
          { label: copy.metaSource, value: test.source.label },
          {
            label: copy.metaQuestions,
            value: formatCount(test.questionCount, lang),
          },
          published
            ? {
                label: copy.metaPublished,
                value: formatDate(test.publishedAt, copy.unknownDate, lang),
              }
            : {
                label: copy.metaUpdated,
                value: formatDate(test.updatedAt, copy.unknownDate, lang),
              },
        ]}
      />

      <div className="finish-grid">
        <div className="finish-grid__main">
          <section
            className="dashboard__section"
            aria-labelledby="test-questions-heading"
          >
            <div className="section-head">
              <h2 id="test-questions-heading">{copy.questionsHeading}</h2>
              <span className="count-chip">
                {formatCount(questions.length, lang)}
              </span>
            </div>
            <p className="section-lead">{copy.questionsLead}</p>
            {questionsQuery.isError ? (
              <EmptyNote
                tone="error"
                title={copy.loadErrorTitle}
                body={copy.loadErrorBody}
              />
            ) : questionsQuery.isPending ? (
              <p className="loading-note" role="status">
                {copy.loading}
              </p>
            ) : questions.length === 0 ? (
              <EmptyNote
                icon="spark"
                title={copy.questionsEmptyTitle}
                body={copy.questionsEmptyBody}
              />
            ) : (
              <QuestionsList
                teacherId={teacherId}
                test={test}
                questions={questions}
                readOnly={published}
              />
            )}
          </section>
        </div>

        <div className="finish-grid__side">
          {!published && teacherId ? (
            <DraftPanel teacherId={teacherId} test={test} />
          ) : (
            <section className="dashboard__section">
              <h2>{copy.readOnlyTitle}</h2>
              <p className="section-lead">{copy.readOnlyBody}</p>
            </section>
          )}

          {teacherId ? (
            <ResultsPanel testId={test.id} />
          ) : null}
        </div>
      </div>
    </Frame>
  )
}

/**
 * Per-test results — every attempt on this test, with the backend-supplied
 * score. The list is teacher-only (`attempts.listForTest`); a row never shows a
 * computed value, and a null score reads as "not scored yet", never as zero.
 */
function ResultsPanel({ testId }: { testId: string }) {
  const strings = useStrings()
  const copy = strings.testDetail
  const lang = useLang()
  const resultsQuery = useQuery(testAttemptsQueryOptions(testId))

  return (
    <section
      className="dashboard__section"
      aria-labelledby="test-results-heading"
    >
      <div className="section-head">
        <h2 id="test-results-heading">{copy.resultsHeading}</h2>
        {resultsQuery.data ? (
          <span className="count-chip">
            {formatCount(resultsQuery.data.length, lang)}
          </span>
        ) : null}
      </div>
      <p className="section-lead">{copy.resultsLead}</p>
      {resultsQuery.isError ? (
        <EmptyNote
          tone="error"
          title={copy.resultsErrorTitle}
          body={copy.resultsErrorBody}
        />
      ) : resultsQuery.isPending ? (
        <>
          {/* Static skeleton in the results panel's shape — no animation. The
              loading text stays the accessible status for screen readers. */}
          <div className="results-skeleton" aria-hidden="true">
            {[0, 1, 2].map((row) => (
              <div className="results-skeleton__row" key={row}>
                <span className="results-skeleton__line results-skeleton__line--title" />
                <span className="results-skeleton__line" />
                <span className="results-skeleton__line results-skeleton__line--short" />
              </div>
            ))}
          </div>
          <p className="visually-hidden" role="status">
            {copy.resultsLoading}
          </p>
        </>
      ) : resultsQuery.data.length === 0 ? (
        <EmptyNote
          icon="chart"
          title={copy.resultsEmptyTitle}
          body={copy.resultsEmptyBody}
        />
      ) : (
        <div className="panel">
          <ul className="attempt-list">
            {resultsQuery.data.map((attempt) => (
              <li className="attempt-row" key={attempt.id}>
                <div className="attempt-row__main">
                  <div className="attempt-row__head">
                    <h3>{attempt.studentName}</h3>
                    <StatusChip
                      tone={
                        attempt.status === 'submitted' ? 'success' : 'warning'
                      }
                      icon={attempt.status === 'submitted' ? 'check' : 'clock'}
                      label={
                        attempt.status === 'submitted'
                          ? copy.attemptSubmitted
                          : copy.attemptInProgress
                      }
                    />
                  </div>
                  <p className="row-meta">
                    {copy.answeredValue(
                      formatCount(attempt.answeredCount, lang),
                      formatCount(attempt.questionCount, lang),
                    )}
                  </p>
                  <p className="row-meta">
                    {copy.submittedAtLabel}:{' '}
                    {formatDate(attempt.submittedAt, copy.notSubmitted, lang)}
                  </p>
                </div>
                <p className="attempt-score">
                  <span className="attempt-score__label">
                    {copy.scoreLabel}
                  </span>
                  <strong>
                    {attempt.scorePercent === null
                      ? copy.scoreUnavailable
                      : formatPercent(attempt.scorePercent, lang)}
                  </strong>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

/** Draft-only panel: edit title/description and publish. */
function DraftPanel({ teacherId, test }: { teacherId: UserId; test: Test }) {
  const strings = useStrings()
  const copy = strings.testDetail
  const queryClient = useQueryClient()
  const [title, setTitle] = useState(test.title)
  const [description, setDescription] = useState(test.description ?? '')
  const [saved, setSaved] = useState(false)

  const updateMutation = useMutation({
    mutationFn: () =>
      api.tests.update({
        teacherId,
        testId: test.id,
        title: title.trim(),
        description: description.trim() === '' ? null : description.trim(),
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(testQueryOptions(test.id).queryKey, updated)
      setSaved(true)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.forTeacher(teacherId),
      })
    },
  })

  const publishMutation = useMutation({
    mutationFn: () => api.tests.publish({ teacherId, testId: test.id }),
    onSuccess: (updated) => {
      queryClient.setQueryData(testQueryOptions(test.id).queryKey, updated)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.forTeacher(teacherId),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.forClass(test.classroomId),
      })
    },
  })

  const questionCount = useQuery(testQuestionsQueryOptions(test.id)).data?.length ?? 0
  const canPublish = questionCount > 0

  return (
    <>
      <section
        className="dashboard__section"
        aria-labelledby="test-edit-heading"
      >
        <h2 id="test-edit-heading">{copy.editHeading}</h2>
        <p className="section-lead">{copy.editLead}</p>
        <form
          className="builder-form"
          onSubmit={(event) => {
            event.preventDefault()
            setSaved(false)
            updateMutation.mutate()
          }}
        >
          <label className="field">
            <span className="field__label">{copy.titleLabel}</span>
            <input
              className="input"
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setSaved(false)
              }}
              required
            />
          </label>
          <label className="field">
            <span className="field__label">{copy.descriptionLabel}</span>
            <textarea
              className="textarea"
              value={description}
              placeholder={copy.descriptionPlaceholder}
              onChange={(event) => {
                setDescription(event.target.value)
                setSaved(false)
              }}
            />
          </label>
          {updateMutation.isError ? (
            <EmptyNote
              tone="error"
              title={copy.saveErrorTitle}
              body={copy.saveErrorBody}
            />
          ) : null}
          {saved ? (
            <p className="finish-note" role="status">
              {copy.saved}
            </p>
          ) : null}
          <div className="builder-actions">
            <button
              type="submit"
              className="button button--primary"
              disabled={updateMutation.isPending || title.trim() === ''}
            >
              {updateMutation.isPending ? copy.saving : copy.save}
            </button>
          </div>
        </form>
      </section>

      <section
        className="dashboard__section"
        aria-labelledby="test-publish-heading"
      >
        <h2 id="test-publish-heading">{copy.publishHeading}</h2>
        <p className="section-lead">{copy.publishLead}</p>
        {!canPublish ? (
          <EmptyNote
            icon="alert"
            title={copy.publishBlockedNoQuestions}
            body={copy.questionsEmptyBody}
          />
        ) : null}
        {publishMutation.isError ? (
          <EmptyNote
            tone="error"
            title={copy.publishErrorTitle}
            body={copy.publishErrorBody}
          />
        ) : null}
        <div className="builder-actions">
          <button
            type="button"
            className="button button--primary"
            disabled={!canPublish || publishMutation.isPending}
            onClick={() => publishMutation.mutate()}
          >
            {publishMutation.isPending ? copy.publishing : copy.publish}
          </button>
        </div>
      </section>
    </>
  )
}

/** Question list. Read-only when the test is published. */
function QuestionsList({
  teacherId,
  test,
  questions,
  readOnly,
}: {
  teacherId: UserId | null
  test: Test
  questions: Question[]
  readOnly: boolean
}) {
  const strings = useStrings()
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (input: { questionId: string; draft: QuestionDraft }) =>
      api.questions.update({
        teacherId: teacherId ?? '',
        testId: test.id,
        questionId: input.questionId,
        prompt: input.draft.prompt,
        options: input.draft.options,
        correctOptionIndex: input.draft.correctIndex,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Question[]>(
        testQuestionsQueryOptions(test.id).queryKey,
        (current) => replaceQuestion(current ?? [], updated),
      )
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.detail(test.id),
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (questionId: string) =>
      api.questions.delete({
        teacherId: teacherId ?? '',
        testId: test.id,
        questionId,
      }),
    onSuccess: (_result, questionId) => {
      queryClient.setQueryData<Question[]>(
        testQuestionsQueryOptions(test.id).queryKey,
        (current) => removeQuestion(current ?? [], questionId),
      )
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.detail(test.id),
      })
    },
  })

  async function saveQuestion(
    questionId: string,
    draft: QuestionDraft,
  ): Promise<boolean> {
    try {
      await updateMutation.mutateAsync({ questionId, draft })
      return true
    } catch {
      return false
    }
  }

  async function deleteQuestion(questionId: string): Promise<boolean> {
    try {
      await deleteMutation.mutateAsync(questionId)
      return true
    } catch {
      return false
    }
  }

  return (
    <ol className="question-list">
      {questions.map((question) => (
        <li key={question.id}>
          <QuestionCard
            question={question}
            readOnly={readOnly}
            onSave={
              readOnly
                ? undefined
                : (draft) => saveQuestion(question.id, draft)
            }
            onDelete={
              readOnly ? undefined : () => deleteQuestion(question.id)
            }
          />
        </li>
      ))}
    </ol>
  )
}

function Frame({
  title,
  greeting,
  children,
}: {
  title: string
  greeting?: React.ReactNode
  children: React.ReactNode
}) {
  const strings = useStrings()
  const role = usePreviewRole()
  const lang = useLang()
  return (
    <div className="dashboard">
      <Link
        to="/teacher/tests"
        search={{ as: role, lang }}
        className="page-back"
        preload={false}
      >
        {strings.testDetail.back}
      </Link>
      <PageHero
        badge={strings.testDetail.badge}
        title={title}
        footer={greeting}
      />
      {children}
    </div>
  )
}
