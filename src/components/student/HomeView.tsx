import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  studentAttemptsQueryOptions,
  studentProfileQueryOptions,
  studentProgressQueryOptions,
} from '~/api/queries'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { ProgressBar } from '~/components/dashboard/ProgressBar'
import { StatusChip } from '~/components/dashboard/StatusChip'
import {
  formatCount,
  formatDate,
  formatPercent,
} from '~/components/dashboard/format'
import { MetaList } from '~/components/shared/MetaList'
import { MetaPair } from '~/components/shared/MetaPair'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Student home — where `/` lands a student.
 *
 * Three existing PROPOSED reads and nothing else: `students.getProfile` (name
 * and grade), `students.getProgress` (overall percent, units, last activity)
 * and `attempts.listForStudent` (the latest attempts). The screen computes no
 * percent and no score; the attempt list carries no score, so it shows only the
 * backend-supplied status and answered count instead of inventing one.
 */
export function HomeView() {
  const strings = useStrings()
  const copy = strings.studentHome
  const progressCopy = strings.progress
  const lang = useLang()
  const role = usePreviewRole()

  const sessionQuery = useQuery(sessionQueryOptions())
  const studentId =
    sessionQuery.data?.user.role === 'student'
      ? sessionQuery.data.user.id
      : null

  const profileQuery = useQuery({
    ...studentProfileQueryOptions(studentId ?? ''),
    enabled: studentId !== null,
  })
  const progressQuery = useQuery({
    ...studentProgressQueryOptions(studentId ?? ''),
    enabled: studentId !== null,
  })
  const attemptsQuery = useQuery({
    ...studentAttemptsQueryOptions(studentId ?? ''),
    enabled: studentId !== null,
  })

  if (sessionQuery.isPending || (studentId !== null && profileQuery.isPending)) {
    return (
      <Frame>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (sessionQuery.isError || profileQuery.isError) {
    return (
      <Frame>
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  if (studentId === null || !profileQuery.data) {
    return (
      <Frame>
        <EmptyNote
          icon="alert"
          title={copy.noSessionTitle}
          body={copy.noSessionBody}
        />
      </Frame>
    )
  }

  const profile = profileQuery.data

  return (
    <Frame
      greeting={
        <p className="dashboard__greeting">
          {copy.greeting(profile.user.displayName)}
        </p>
      }
    >
      <section
        className="dashboard__section student-home__section"
        aria-labelledby="student-home-progress"
      >
        <div className="section-head">
          <h2 id="student-home-progress">{copy.progressHeading}</h2>
          {progressQuery.data ? (
            <span className="count-chip">
              {formatPercent(progressQuery.data.overallPercent, lang)}
            </span>
          ) : null}
        </div>

        {progressQuery.isPending ? (
          <p className="loading-note" role="status">
            {copy.loading}
          </p>
        ) : progressQuery.isError || !progressQuery.data ? (
          <EmptyNote
            tone="error"
            title={copy.loadErrorTitle}
            body={copy.loadErrorBody}
          />
        ) : (
          <>
            <MetaList
              items={[
                {
                  label: copy.overallLabel,
                  value: formatPercent(
                    progressQuery.data.overallPercent,
                    lang,
                  ),
                },
                { label: copy.classLabel, value: profile.gradeLevel },
                {
                  label: copy.unitsLabel,
                  value: formatCount(progressQuery.data.units.length, lang),
                },
                {
                  label: copy.lastActive,
                  value: formatDate(
                    progressQuery.data.lastActiveAt,
                    copy.noActivity,
                    lang,
                  ),
                },
              ]}
            />
            {progressQuery.data.units.length === 0 ? (
              <EmptyNote
                icon="chart"
                title={copy.progressHeading}
                body={copy.unitsEmpty}
              />
            ) : (
              <ul className="parent-unit-list">
                {progressQuery.data.units.map((entry) => (
                  <li className="parent-unit" key={entry.unit.id}>
                    <div className="parent-unit__head">
                      <h3>{entry.unit.title}</h3>
                      <div className="parent-score">
                        <span className="parent-score__label">
                          {copy.overallLabel}
                        </span>
                        <strong>
                          {formatPercent(entry.progressPercent, lang)}
                        </strong>
                      </div>
                    </div>
                    <ProgressBar
                      percent={entry.progressPercent}
                      label={progressCopy.barLabel(entry.unit.title)}
                      valueText={formatPercent(entry.progressPercent, lang)}
                    />
                    <p className="row-meta">
                      <MetaPair label={progressCopy.lessonsCompleted}>
                        {formatCount(entry.lessonsCompleted, lang)}
                      </MetaPair>
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <p className="finish-actions">
              <Link
                to="/student/lessons"
                search={{ as: role, lang }}
                className="button button--secondary button--small"
                preload={false}
              >
                {copy.openLessons}
              </Link>
            </p>
          </>
        )}
      </section>

      <section
        className="dashboard__section"
        aria-labelledby="student-home-attempts"
      >
        <div className="section-head">
          <h2 id="student-home-attempts">{copy.attemptsHeading}</h2>
          {attemptsQuery.data ? (
            <span className="count-chip">
              {formatCount(attemptsQuery.data.length, lang)}
            </span>
          ) : null}
        </div>

        {attemptsQuery.isPending ? (
          <p className="loading-note" role="status">
            {copy.loading}
          </p>
        ) : attemptsQuery.isError || !attemptsQuery.data ? (
          <EmptyNote
            tone="error"
            title={copy.loadErrorTitle}
            body={copy.loadErrorBody}
          />
        ) : attemptsQuery.data.length === 0 ? (
          <EmptyNote
            icon="tests"
            title={copy.attemptsHeading}
            body={copy.attemptsEmpty}
          />
        ) : (
          <ul className="attempt-list">
            {attemptsQuery.data.map((attempt) => {
              const submitted = attempt.status === 'submitted'
              return (
                <li className="attempt-row" key={attempt.id}>
                  <div className="attempt-row__main">
                    <div className="attempt-row__head">
                      <h3>{attempt.testTitle}</h3>
                      <StatusChip
                        tone={submitted ? 'success' : 'warning'}
                        icon={submitted ? 'check' : 'clock'}
                        label={
                          submitted
                            ? copy.statusSubmitted
                            : copy.statusInProgress
                        }
                      />
                    </div>
                    <p className="row-meta">{attempt.classroomName}</p>
                    <p className="row-meta">
                      <MetaPair label={copy.answeredLabel}>
                        {copy.questionsAnswered(
                          formatCount(attempt.answeredCount, lang),
                          formatCount(attempt.questionCount, lang),
                        )}
                      </MetaPair>
                    </p>
                  </div>
                  {submitted ? (
                    <Link
                      to="/student/tests/$testId/results"
                      params={{ testId: attempt.testId }}
                      search={{ as: role, lang }}
                      className="button button--secondary button--small"
                      preload={false}
                    >
                      {copy.openAttempt}
                    </Link>
                  ) : (
                    <Link
                      to="/student/tests"
                      search={{ as: role, lang }}
                      className="button button--secondary button--small"
                      preload={false}
                    >
                      {copy.openAttempt}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        <p className="finish-actions">
          <Link
            to="/student/tests"
            search={{ as: role, lang }}
            className="button button--secondary button--small"
            preload={false}
          >
            {copy.openTests}
          </Link>
        </p>
      </section>
    </Frame>
  )
}

function Frame({
  greeting,
  children,
}: {
  greeting?: React.ReactNode
  children: React.ReactNode
}) {
  const copy = useStrings().studentHome
  return (
    <div className="dashboard">
      <PageHero
        badge={copy.badge}
        title={copy.title}
        lead={copy.lead}
        footer={greeting}
      />
      {children}
    </div>
  )
}
