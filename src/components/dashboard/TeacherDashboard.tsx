import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { sessionQueryOptions, teacherDashboardQueryOptions } from '~/api/queries'
import { ar } from '~/content/strings'
import { EmptyNote } from './EmptyNote'
import { ProgressBar } from './ProgressBar'
import { StatusChip } from './StatusChip'
import { formatCount, formatDate, formatPercent, isDashboardEmpty } from './format'
import { Icon } from './icons'

/**
 * Stage 2 — teacher dashboard.
 *
 * "Classes, recent tests, student progress at a glance", led by time saved.
 * Every value on this screen comes from one adapter call
 * (`teachers.getDashboard`) through TanStack Query; no data is hard-coded here.
 * Teacher identity comes from the Mentingo-owned session, not from a BRIDGIO
 * user model, and the preview role (`?as`) remains UI state only.
 */

const strings = ar.dashboard

export function TeacherDashboard() {
  const sessionQuery = useQuery(sessionQueryOptions())
  const teacherId =
    sessionQuery.data?.user.role === 'teacher'
      ? sessionQuery.data.user.id
      : null

  const dashboardQuery = useQuery({
    ...teacherDashboardQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })

  if (sessionQuery.isPending) {
    return (
      <DashboardFrame>
        <p className="dashboard__loading" role="status">
          {strings.loading}
        </p>
      </DashboardFrame>
    )
  }

  if (sessionQuery.isError) {
    return (
      <DashboardFrame>
        <EmptyNote
          tone="error"
          title={strings.loadErrorTitle}
          body={strings.loadErrorBody}
        />
      </DashboardFrame>
    )
  }

  if (teacherId === null) {
    return (
      <DashboardFrame>
        <EmptyNote
          icon="alert"
          title={strings.noSessionTitle}
          body={strings.noSessionBody}
        />
      </DashboardFrame>
    )
  }

  if (dashboardQuery.isPending) {
    return (
      <DashboardFrame>
        <p className="dashboard__loading" role="status">
          {strings.loading}
        </p>
      </DashboardFrame>
    )
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <DashboardFrame>
        <EmptyNote
          tone="error"
          title={strings.loadErrorTitle}
          body={strings.loadErrorBody}
        />
      </DashboardFrame>
    )
  }

  const dashboard = dashboardQuery.data

  return (
    <DashboardFrame greeting={strings.greeting(dashboard.teacher.displayName)}>
      {isDashboardEmpty(dashboard) ? (
        <EmptyNote
          title={strings.emptyAllTitle}
          body={strings.emptyAllBody}
        />
      ) : (
        <>
          <section
            className="dashboard__totals"
            aria-label={strings.totals.label}
          >
            <Total
              icon="classes"
              value={dashboard.totals.classes}
              label={strings.totals.classes}
            />
            <Total
              icon="students"
              value={dashboard.totals.students}
              label={strings.totals.students}
            />
            <Total
              icon="tests"
              value={dashboard.totals.publishedTests}
              label={strings.totals.publishedTests}
            />
            <Total
              icon="drafts"
              value={dashboard.totals.draftTests}
              label={strings.totals.draftTests}
            />
          </section>

          <section
            className="dashboard__section"
            aria-labelledby="dashboard-classes-heading"
          >
            <SectionHead
              id="dashboard-classes-heading"
              title={strings.classes.heading}
              count={dashboard.classes.length}
            />
            {dashboard.classes.length === 0 ? (
              <EmptyNote
                icon="classes"
                title={strings.classes.emptyTitle}
                body={strings.classes.emptyBody}
              />
            ) : (
              <ul className="class-grid">
                {dashboard.classes.map((classroom) => (
                  <li className="class-card" key={classroom.id}>
                    <h3>{classroom.name}</h3>
                    <p className="row-meta">
                      {classroom.subjectName} · {classroom.gradeLevel}
                    </p>
                    <dl className="class-card__stats">
                      <div>
                        <dt>{strings.classes.students}</dt>
                        <dd>{formatCount(classroom.studentCount)}</dd>
                      </div>
                      <div>
                        <dt>{strings.classes.units}</dt>
                        <dd>{formatCount(classroom.unitCount)}</dd>
                      </div>
                      <div>
                        <dt>{strings.classes.lessons}</dt>
                        <dd>{formatCount(classroom.lessonCount)}</dd>
                      </div>
                    </dl>
                    {classroom.certificateNote ? (
                      <p className="class-card__note">
                        {classroom.certificateNote}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section
            className="dashboard__section"
            aria-labelledby="dashboard-tests-heading"
          >
            <SectionHead
              id="dashboard-tests-heading"
              title={strings.tests.heading}
              count={dashboard.recentTests.length}
            />
            {dashboard.recentTests.length === 0 ? (
              <EmptyNote
                icon="tests"
                title={strings.tests.emptyTitle}
                body={strings.tests.emptyBody}
              />
            ) : (
              <div className="panel">
                <ul className="test-list">
                  {dashboard.recentTests.map((test) => (
                    <li className="test-row" key={test.id}>
                      <div className="test-row__main">
                        <h3>{test.title}</h3>
                        <p className="row-meta">{test.classroomName}</p>
                      </div>
                      <div className="test-row__aside">
                        <StatusChip
                          tone={
                            test.status === 'published' ? 'success' : 'warning'
                          }
                          icon={test.status === 'published' ? 'check' : 'pencil'}
                          label={
                            test.status === 'published'
                              ? strings.tests.statusPublished
                              : strings.tests.statusDraft
                          }
                        />
                        <p className="row-meta">
                          {formatCount(test.questionCount)}{' '}
                          {strings.tests.questions}
                        </p>
                        <p className="row-meta">
                          {strings.tests.updated}:{' '}
                          {formatDate(test.updatedAt, strings.tests.unknownDate)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section
            className="dashboard__section"
            aria-labelledby="dashboard-progress-heading"
          >
            <SectionHead
              id="dashboard-progress-heading"
              title={strings.progress.heading}
              count={dashboard.studentProgress.length}
            />
            <p className="dashboard__section-lead">{strings.progress.lead}</p>
            {dashboard.studentProgress.length === 0 ? (
              <EmptyNote
                icon="chart"
                title={strings.progress.emptyTitle}
                body={strings.progress.emptyBody}
              />
            ) : (
              <div className="panel">
                <ul className="progress-list">
                  {dashboard.studentProgress.map((row) => (
                    <li
                      className="progress-row"
                      key={`${row.classroomId}:${row.student.id}`}
                    >
                      <div className="progress-row__who">
                        <h3>{row.student.displayName}</h3>
                        <p className="row-meta">{row.classroomName}</p>
                      </div>
                      <div className="progress-row__detail">
                        <div className="progress-row__labels">
                          <span>{strings.progress.percentLabel}</span>
                          <strong>{formatPercent(row.progressPercent)}</strong>
                        </div>
                        <ProgressBar
                          percent={row.progressPercent}
                          label={strings.progress.barLabel(
                            row.student.displayName,
                          )}
                          valueText={formatPercent(row.progressPercent)}
                        />
                        <p className="row-meta">
                          {strings.progress.unitsCompleted}:{' '}
                          {formatCount(row.completedUnits)} /{' '}
                          {formatCount(row.totalUnits)}
                        </p>
                        <p className="row-meta">
                          {strings.progress.lastActive}:{' '}
                          {formatDate(
                            row.lastActiveAt,
                            strings.progress.noActivity,
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </>
      )}
    </DashboardFrame>
  )
}

function DashboardFrame({
  greeting,
  children,
}: {
  greeting?: string
  children: ReactNode
}) {
  return (
    <div className="dashboard">
      <header className="dashboard__hero">
        <p className="app-shell__badge">{strings.badge}</p>
        <h1>{strings.title}</h1>
        <p className="dashboard__lead">{strings.lead}</p>
        {greeting ? <p className="dashboard__greeting">{greeting}</p> : null}
      </header>
      {children}
    </div>
  )
}

function SectionHead({
  id,
  title,
  count,
}: {
  id: string
  title: string
  count: number
}) {
  return (
    <div className="dashboard__section-head">
      <h2 id={id}>{title}</h2>
      <span className="dashboard__count">{formatCount(count)}</span>
    </div>
  )
}

function Total({
  icon,
  value,
  label,
}: {
  icon: 'classes' | 'students' | 'tests' | 'drafts'
  value: number
  label: string
}) {
  return (
    <article className="total-card">
      <span className="total-card__icon" aria-hidden="true">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <p className="total-card__value">{formatCount(value)}</p>
        <p className="total-card__label">{label}</p>
      </div>
    </article>
  )
}
