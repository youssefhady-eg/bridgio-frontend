import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  teacherDashboardQueryOptions,
} from '~/api/queries'
import type { StudentProgressSnapshot } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { ProgressBar } from '~/components/dashboard/ProgressBar'
import { formatCount, formatDate, formatPercent } from '~/components/dashboard/format'
import { MetaPair } from '~/components/shared/MetaPair'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Teacher "Students" — every student of the teacher's classes.
 *
 * The list is the `studentProgress` rows of the teacher dashboard aggregate
 * (`teachers.getDashboard`, PROPOSED). A student in two classes appears twice
 * there, so the screen keeps the row that needs attention most (lowest
 * progress) and shows that student's class. Nothing is computed beyond that
 * presentation choice: `progressPercent` and `lastActiveAt` are backend values.
 */
export function StudentList() {
  const strings = useStrings()
  const copy = strings.students
  const lang = useLang()
  const role = usePreviewRole()

  const sessionQuery = useQuery(sessionQueryOptions())
  const teacherId =
    sessionQuery.data?.user.role === 'teacher'
      ? sessionQuery.data.user.id
      : null

  const dashboardQuery = useQuery({
    ...teacherDashboardQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })

  if (sessionQuery.isPending || (teacherId !== null && dashboardQuery.isPending)) {
    return (
      <Frame>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (sessionQuery.isError) {
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

  if (teacherId === null) {
    return (
      <Frame>
        <EmptyNote
          icon="alert"
          title={strings.dashboard.noSessionTitle}
          body={strings.dashboard.noSessionBody}
        />
      </Frame>
    )
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
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

  const students = collapseByStudent(dashboardQuery.data.studentProgress)

  return (
    <Frame>
      {students.length === 0 ? (
        <EmptyNote
          icon="students"
          title={copy.emptyTitle}
          body={copy.emptyBody}
        />
      ) : (
        <section
          className="dashboard__section"
          aria-labelledby="students-heading"
        >
          <div className="section-head">
            <h2 id="students-heading">{strings.nav['teacher-students']}</h2>
            <span className="count-chip">
              {formatCount(students.length, lang)}
            </span>
          </div>
          <div className="panel">
            <ul className="progress-list">
              {students.map((entry) => (
                <li className="progress-row" key={entry.student.id}>
                  <div className="progress-row__who">
                    <h3>
                      <Link
                        to="/teacher/students/$studentId"
                        params={{ studentId: entry.student.id }}
                        search={{ as: role, lang }}
                        className="screen-link"
                        preload={false}
                      >
                        <bdi>{entry.student.displayName}</bdi>
                      </Link>
                    </h3>
                    <p className="row-meta">
                      {copy.classLabel}: <bdi>{entry.classroomName}</bdi>
                    </p>
                  </div>
                  <div className="progress-row__detail">
                    <div className="progress-row__labels">
                      <span>{copy.progressLabel}</span>
                      <strong>{formatPercent(entry.progressPercent, lang)}</strong>
                    </div>
                    <ProgressBar
                      percent={entry.progressPercent}
                      label={strings.dashboard.progress.barLabel(
                        entry.student.displayName,
                      )}
                      valueText={formatPercent(entry.progressPercent, lang)}
                    />
                    <p className="row-meta">
                      <MetaPair label={copy.lastActive}>
                        {formatDate(entry.lastActiveAt, copy.noActivity, lang)}
                      </MetaPair>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </Frame>
  )
}

/**
 * One row per student. A student enrolled in two classes has two backend rows;
 * the one with the lowest progress is kept so the list points at the class that
 * needs attention first.
 */
function collapseByStudent(
  rows: readonly StudentProgressSnapshot[],
): StudentProgressSnapshot[] {
  const byStudent = new Map<string, StudentProgressSnapshot>()
  for (const row of rows) {
    const current = byStudent.get(row.student.id)
    if (!current || row.progressPercent < current.progressPercent) {
      byStudent.set(row.student.id, row)
    }
  }
  return [...byStudent.values()].sort(
    (left, right) => left.progressPercent - right.progressPercent,
  )
}

function Frame({ children }: { children: React.ReactNode }) {
  const copy = useStrings().students
  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />
      {children}
    </div>
  )
}
