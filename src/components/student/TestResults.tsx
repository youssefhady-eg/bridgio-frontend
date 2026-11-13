import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { api } from '~/api'
import {
  attemptQueryOptions,
  sessionQueryOptions,
  studentAttemptsQueryOptions,
  studentTestQuestionsQueryOptions,
} from '~/api/queries'
import type { StudentQuestion } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip } from '~/components/dashboard/StatusChip'
import { formatCount, formatDate, formatPercent } from '~/components/dashboard/format'
import { MetaList } from '~/components/shared/MetaList'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Student test review — the student's own answers, question by question.
 *
 * The attempt and its saved answers come from `attempts.listForStudent` and
 * `attempts.get`; the prompts and option texts come from the student-safe
 * `questions.listForStudentTest` (never `listForTest`, so no answer key can
 * reach this screen). The score is backend-supplied (`Attempt.scorePercent`);
 * this screen renders it as given, shows "score unavailable" when it is null,
 * and never marks an answer or computes a score. "Retake" is offered but the
 * mock rejects a second attempt on a submitted test (`attempts.start` →
 * CONFLICT); the honest error is surfaced rather than hidden, and the gap is
 * documented.
 */
export function TestResults({ testId }: { testId: string }) {
  const strings = useStrings()
  const copy = strings.results
  const lang = useLang()
  const role = usePreviewRole()
  const navigate = useNavigate()

  const sessionQuery = useQuery(sessionQueryOptions())
  const studentId =
    sessionQuery.data?.user.role === 'student'
      ? sessionQuery.data.user.id
      : null

  const attemptsQuery = useQuery({
    ...studentAttemptsQueryOptions(studentId ?? ''),
    enabled: studentId !== null,
  })

  const attemptSummary =
    attemptsQuery.data?.find((attempt) => attempt.testId === testId) ?? null

  const attemptQuery = useQuery({
    ...attemptQueryOptions(attemptSummary?.id ?? ''),
    enabled: attemptSummary !== null,
  })

  const questionsQuery = useQuery({
    ...studentTestQuestionsQueryOptions(testId),
    enabled: attemptSummary !== null,
  })

  const retakeMutation = useMutation({
    mutationFn: () =>
      api.attempts.start({ studentId: studentId ?? '', testId }),
    onSuccess: () => {
      void navigate({
        to: '/student/tests',
        search: { as: role, lang },
      })
    },
  })

  if (sessionQuery.isPending || (studentId !== null && attemptsQuery.isPending)) {
    return (
      <Frame title={strings.nav['student-tests']}>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (sessionQuery.isError) {
    return (
      <Frame title={strings.nav['student-tests']}>
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  if (studentId === null) {
    return (
      <Frame title={strings.nav['student-tests']}>
        <EmptyNote
          icon="alert"
          title={strings.player.noSessionTitle}
          body={strings.player.noSessionBody}
        />
      </Frame>
    )
  }

  if (attemptsQuery.isError) {
    return (
      <Frame title={strings.nav['student-tests']}>
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  if (!attemptSummary || attemptQuery.isPending || !attemptQuery.data) {
    if (!attemptSummary) {
      return (
        <Frame title={strings.nav['student-tests']}>
          <EmptyNote
            icon="alert"
            title={copy.notFoundTitle}
            body={copy.notFoundBody}
          />
        </Frame>
      )
    }
    return (
      <Frame title={strings.nav['student-tests']}>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  const attempt = attemptQuery.data
  const questions: StudentQuestion[] = questionsQuery.data ?? []
  const submitted = attempt.status === 'submitted'

  return (
    <Frame
      title={attempt.testTitle}
      greeting={
        <div className="finish-row">
          <StatusChip
            tone={submitted ? 'success' : 'warning'}
            icon={submitted ? 'check' : 'clock'}
            label={submitted ? copy.statusSubmitted : copy.statusInProgress}
          />
          <span className="row-meta">{attempt.classroomName}</span>
        </div>
      }
    >
      <MetaList
        items={[
          {
            label: copy.statusLabel,
            value: submitted ? copy.statusSubmitted : copy.statusInProgress,
          },
          {
            label: copy.submittedAtLabel,
            value: formatDate(attempt.submittedAt, copy.noSubmit, lang),
          },
          {
            label: copy.answeredLabel,
            value: copy.answeredValue(
              formatCount(attempt.answeredCount, lang),
              formatCount(attempt.questionCount, lang),
            ),
          },
          {
            label: copy.scoreLabel,
            value:
              attempt.scorePercent === null ? (
                <span className="score-unavailable">
                  {copy.scoreUnavailable}
                </span>
              ) : (
                <strong className="score-value">
                  {formatPercent(attempt.scorePercent, lang)}
                </strong>
              ),
          },
        ]}
      />

      {!submitted ? (
        <EmptyNote
          icon="clock"
          title={copy.notSubmittedTitle}
          body={copy.notSubmittedBody}
        />
      ) : (
        <section
          className="dashboard__section"
          aria-labelledby="review-heading"
        >
          <div className="section-head">
            <h2 id="review-heading">{copy.reviewHeading}</h2>
            <span className="count-chip">
              {formatCount(questions.length, lang)}
            </span>
          </div>
          <p className="section-lead">{copy.reviewLead}</p>
          {questions.length === 0 ? (
            <EmptyNote
              icon="tests"
              title={copy.notFoundTitle}
              body={copy.notFoundBody}
            />
          ) : (
            <ol className="result-list">
              {questions.map((question, index) => {
                const answer = attempt.answers.find(
                  (entry) => entry.questionId === question.id,
                )
                const chosenId = answer?.optionId ?? null
                return (
                  <li className="result-question" key={question.id}>
                    <p className="result-question__number">
                      {copy.questionLabel(formatCount(index + 1, lang))}
                    </p>
                    <h3>{question.prompt}</h3>
                    <ul className="result-question__options">
                      {question.options.map((option) => {
                        const chosen = option.id === chosenId
                        return (
                          <li
                            key={option.id}
                            className={`result-question__option${
                              chosen ? ' is-chosen' : ''
                            }`}
                          >
                            {chosen ? (
                              <StatusChip
                                tone="neutral"
                                icon="check"
                                label={copy.yourAnswer}
                              />
                            ) : null}
                            <span>{option.text}</span>
                          </li>
                        )
                      })}
                    </ul>
                    {chosenId === null ? (
                      <p className="result-question__chosen-note">
                        {copy.noAnswer}
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      )}

      {submitted ? (
        <section
          className="dashboard__section"
          aria-labelledby="retake-heading"
        >
          <h2 id="retake-heading">{copy.retakeHeading}</h2>
          <p className="section-lead">{copy.retakeBody}</p>
          {retakeMutation.isError ? (
            <EmptyNote
              tone="error"
              title={copy.retakeErrorTitle}
              body={copy.retakeErrorBody}
            />
          ) : null}
          <div className="builder-actions">
            <button
              type="button"
              className="button button--secondary"
              disabled={retakeMutation.isPending}
              onClick={() => retakeMutation.mutate()}
            >
              {retakeMutation.isPending ? copy.retaking : copy.retake}
            </button>
          </div>
        </section>
      ) : null}
    </Frame>
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
        to="/student/tests"
        search={{ as: role, lang }}
        className="page-back"
        preload={false}
      >
        {strings.results.back}
      </Link>
      <PageHero
        badge={strings.results.badge}
        title={title}
        lead={strings.results.lead}
        footer={greeting}
      />
      {children}
    </div>
  )
}
