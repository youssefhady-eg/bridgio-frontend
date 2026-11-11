import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { sessionQueryOptions, teacherDashboardQueryOptions } from '~/api/queries'
import type { TestSummary } from '~/api/types'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'
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
 *
 * The denser desktop composition reorders and groups the same adapter values:
 * quick actions, tests needing attention, recent activity, student progress and
 * classes. It never computes a score or invents a record.
 */

export function TeacherDashboard() {
  const sessionQuery = useQuery(sessionQueryOptions())
  const strings = useStrings().dashboard
  const lang = useLang()
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
        <p className="loading-note" role="status">
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
        <p className="loading-note" role="status">
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

  // Presentation-only ordering of adapter values. The adapter already sorts,
  // but the screen states its own intent: newest activity, drafts first, and
  // the students who need attention first.
  const activity = [...dashboard.recentTests].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  )
  const attention = activity
    .filter((test) => test.status !== 'published')
    .sort((left, right) => {
      if (left.status === 'draft' && right.status !== 'draft') return -1
      if (right.status === 'draft' && left.status !== 'draft') return 1
      return right.updatedAt.localeCompare(left.updatedAt)
    })
  const students = [...dashboard.studentProgress].sort(
    (left, right) => left.progressPercent - right.progressPercent,
  )

  return (
    <DashboardFrame greeting={strings.greeting(dashboard.teacher.displayName)}>
      <QuickActions />

      {isDashboardEmpty(dashboard) ? (
        <EmptyNote title={strings.emptyAllTitle} body={strings.emptyAllBody} />
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

          <div className="dashboard__grid">
            <div className="dashboard__col dashboard__col--main">
              <section
                className="dashboard__section"
                aria-labelledby="dashboard-attention-heading"
              >
                <SectionHead
                  id="dashboard-attention-heading"
                  title={strings.attention.heading}
                  count={attention.length}
                />
                <p className="section-lead">{strings.attention.lead}</p>
                {attention.length === 0 ? (
                  <EmptyNote
                    icon="check"
                    tone="success"
                    title={strings.attention.emptyTitle}
                    body={strings.attention.emptyBody}
                  />
                ) : (
                  <div className="panel">
                    <ul className="test-list">
                      {attention.map((test) => (
                        <TestRow test={test} key={test.id} />
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              <section
                className="dashboard__section"
                aria-labelledby="dashboard-activity-heading"
              >
                <SectionHead
                  id="dashboard-activity-heading"
                  title={strings.activity.heading}
                  count={activity.length}
                />
                <p className="section-lead">{strings.activity.lead}</p>
                {activity.length === 0 ? (
                  <EmptyNote
                    icon="tests"
                    title={strings.activity.emptyTitle}
                    body={strings.activity.emptyBody}
                  />
                ) : (
                  <div className="panel">
                    <ul className="test-list">
                      {activity.map((test) => (
                        <TestRow test={test} key={test.id} />
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            </div>

            <div className="dashboard__col dashboard__col--side">
              <section
                className="dashboard__section"
                aria-labelledby="dashboard-progress-heading"
              >
                <SectionHead
                  id="dashboard-progress-heading"
                  title={strings.progress.heading}
                  count={students.length}
                />
                <p className="section-lead">{strings.progress.lead}</p>
                {students.length === 0 ? (
                  <EmptyNote
                    icon="chart"
                    title={strings.progress.emptyTitle}
                    body={strings.progress.emptyBody}
                  />
                ) : (
                  <div className="panel">
                    <ul className="progress-list">
                      {students.map((row) => (
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
                              <strong>
                                {formatPercent(row.progressPercent, lang)}
                              </strong>
                            </div>
                            <ProgressBar
                              percent={row.progressPercent}
                              label={strings.progress.barLabel(
                                row.student.displayName,
                              )}
                              valueText={formatPercent(
                                row.progressPercent,
                                lang,
                              )}
                            />
                            <p className="row-meta">
                              {strings.progress.unitsCompleted}:{' '}
                              {formatCount(row.completedUnits, lang)} /{' '}
                              {formatCount(row.totalUnits, lang)}
                            </p>
                            <p className="row-meta">
                              {strings.progress.lastActive}:{' '}
                              {formatDate(
                                row.lastActiveAt,
                                strings.progress.noActivity,
                                lang,
                              )}
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
                            <dd>{formatCount(classroom.studentCount, lang)}</dd>
                          </div>
                          <div>
                            <dt>{strings.classes.units}</dt>
                            <dd>{formatCount(classroom.unitCount, lang)}</dd>
                          </div>
                          <div>
                            <dt>{strings.classes.lessons}</dt>
                            <dd>{formatCount(classroom.lessonCount, lang)}</dd>
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
            </div>
          </div>
        </>
      )}
    </DashboardFrame>
  )
}

/**
 * Quick actions point only at real screens. The only built teacher test screen
 * is the builder (`/teacher/tests`), so both actions resolve there today; a
 * separate tests list does not exist yet and is not invented here.
 */
function QuickActions() {
  const strings = useStrings().dashboard
  const lang = useLang()
  const role = usePreviewRole()

  return (
    <section
      className="dashboard__quick"
      aria-labelledby="dashboard-quick-heading"
    >
      <div className="section-head">
        <h2 id="dashboard-quick-heading">{strings.quickActions.heading}</h2>
      </div>
      <div className="quick-actions">
        <Link
          to="/teacher/tests"
          search={{ as: role, lang }}
          className="quick-action"
          preload={false}
        >
          <span className="quick-action__icon" aria-hidden="true">
            <Icon name="tests" size={20} />
          </span>
          <span className="quick-action__text">
            <span className="quick-action__title">
              {strings.quickActions.createTest}
            </span>
            <span className="quick-action__body">
              {strings.quickActions.createTestBody}
            </span>
          </span>
        </Link>
        <Link
          to="/teacher/tests"
          search={{ as: role, lang }}
          className="quick-action"
          preload={false}
        >
          <span className="quick-action__icon" aria-hidden="true">
            <Icon name="pencil" size={20} />
          </span>
          <span className="quick-action__text">
            <span className="quick-action__title">
              {strings.quickActions.viewTests}
            </span>
            <span className="quick-action__body">
              {strings.quickActions.viewTestsBody}
            </span>
          </span>
        </Link>
      </div>
    </section>
  )
}

function DashboardFrame({
  greeting,
  children,
}: {
  greeting?: string
  children: ReactNode
}) {
  const strings = useStrings().dashboard
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
  count?: number
}) {
  const lang = useLang()
  return (
    <div className="section-head">
      <h2 id={id}>{title}</h2>
      {count === undefined ? null : (
        <span className="count-chip">{formatCount(count, lang)}</span>
      )}
    </div>
  )
}

function TestRow({ test }: { test: TestSummary }) {
  const strings = useStrings().dashboard
  const lang = useLang()
  const role = usePreviewRole()
  const published = test.status === 'published'
  return (
    <li className="test-row">
      <div className="test-row__main">
        <h3>
          <Link
            to="/teacher/tests/$testId"
            params={{ testId: test.id }}
            search={{ as: role, lang }}
            className="screen-link"
            preload={false}
          >
            {test.title}
          </Link>
        </h3>
        <p className="row-meta">{test.classroomName}</p>
      </div>
      <div className="test-row__aside">
        <StatusChip
          tone={published ? 'success' : 'warning'}
          icon={published ? 'check' : 'pencil'}
          label={
            published
              ? strings.tests.statusPublished
              : strings.tests.statusDraft
          }
        />
        <p className="row-meta">
          {strings.tests.questionsCount(test.questionCount)}
        </p>
        <p className="row-meta">
          {strings.tests.updated}:{' '}
          {formatDate(test.updatedAt, strings.tests.unknownDate, lang)}
        </p>
      </div>
    </li>
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
  const lang = useLang()
  return (
    <article className="total-card">
      <span className="total-card__icon" aria-hidden="true">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <p className="total-card__value">{formatCount(value, lang)}</p>
        <p className="total-card__label">{label}</p>
      </div>
    </article>
  )
}