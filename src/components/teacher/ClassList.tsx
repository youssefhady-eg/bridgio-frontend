import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  teacherClassroomsQueryOptions,
  teacherTestsQueryOptions,
} from '~/api/queries'
import type { ClassroomSummary, TestSummary } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip, type StatusTone } from '~/components/dashboard/StatusChip'
import { formatCount } from '~/components/dashboard/format'
import type { IconName } from '~/components/dashboard/icons'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Teacher "My Classes" — the full class list, as a table.
 *
 * It reads the teacher's classes through `classrooms.listForTeacher` (PROPOSED)
 * and the teacher's tests through `tests.listForTeacher` (PROPOSED), then
 * groups the tests by class for the Tests column. The status column is derived
 * from those same tests and never invented:
 *   - no tests for the class      → "No tests" (neutral)
 *   - at least one draft test     → "Drafts" (warning)
 *   - every test published        → "Published" (success)
 * The name and the action both link to the class detail screen; the detail
 * screen itself is unchanged. No sorting is offered.
 *
 * Table cells wrap entity values in `<bdi>` so an Arabic name next to a Latin
 * subject or a number keeps its own direction in both AR and EN.
 */
export function ClassList() {
  const strings = useStrings()
  const copy = strings.classes
  const lang = useLang()

  const sessionQuery = useQuery(sessionQueryOptions())
  const teacherId =
    sessionQuery.data?.user.role === 'teacher'
      ? sessionQuery.data.user.id
      : null

  const classesQuery = useQuery({
    ...teacherClassroomsQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })
  const testsQuery = useQuery({
    ...teacherTestsQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })

  if (sessionQuery.isPending) {
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

  if (classesQuery.isPending || testsQuery.isPending) {
    return (
      <Frame>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (classesQuery.isError || testsQuery.isError || !classesQuery.data) {
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

  const classes = classesQuery.data
  const tests = testsQuery.data ?? []

  return (
    <Frame>
      {classes.length === 0 ? (
        <EmptyNote
          icon="classes"
          title={copy.emptyTitle}
          body={copy.emptyBody}
        />
      ) : (
        <section
          className="dashboard__section"
          aria-labelledby="classes-heading"
        >
          <div className="section-head">
            <h2 id="classes-heading">{strings.nav['teacher-classes']}</h2>
            <span className="count-chip">
              {formatCount(classes.length, lang)}
            </span>
          </div>
          <div className="class-table-wrap">
            <table className="class-table">
              <caption className="visually-hidden">{copy.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.name}</th>
                  <th scope="col">{copy.subject}</th>
                  <th scope="col">{copy.grade}</th>
                  <th scope="col">{copy.students}</th>
                  <th scope="col">{copy.tests}</th>
                  <th scope="col">{copy.status}</th>
                  <th scope="col">{copy.open}</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classroom) => (
                  <ClassRow
                    key={classroom.id}
                    classroom={classroom}
                    tests={tests.filter(
                      (test) => test.classroomId === classroom.id,
                    )}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </Frame>
  )
}

function ClassRow({
  classroom,
  tests,
}: {
  classroom: ClassroomSummary
  tests: readonly TestSummary[]
}) {
  const copy = useStrings().classes
  const lang = useLang()
  const role = usePreviewRole()
  const status = classStatus(tests, copy)

  return (
    <tr>
      <th scope="row" className="class-table__name">
        <Link
          to="/teacher/classes/$classId"
          params={{ classId: classroom.id }}
          search={{ as: role, lang }}
          className="screen-link"
          preload={false}
        >
          <bdi>{classroom.name}</bdi>
        </Link>
      </th>
      <td>
        <bdi>{classroom.subjectName}</bdi>
      </td>
      <td>
        <bdi>{classroom.gradeLevel}</bdi>
      </td>
      <td className="class-table__number">
        <bdi>{formatCount(classroom.studentCount, lang)}</bdi>
      </td>
      <td className="class-table__number">
        <bdi>{formatCount(tests.length, lang)}</bdi>
      </td>
      <td>
        <StatusChip tone={status.tone} icon={status.icon} label={status.label} />
      </td>
      <td className="class-table__actions">
        <Link
          to="/teacher/classes/$classId"
          params={{ classId: classroom.id }}
          search={{ as: role, lang }}
          className="button button--secondary button--small"
          preload={false}
        >
          {copy.open}
        </Link>
      </td>
    </tr>
  )
}

/**
 * The class status is computed only from the class's own tests. It is a
 * presentation of backend state, not a new backend field.
 */
function classStatus(
  tests: readonly TestSummary[],
  copy: ReturnType<typeof useStrings>['classes'],
): { label: string; tone: StatusTone; icon: IconName } {
  if (tests.length === 0) {
    return { label: copy.statusNoTests, tone: 'neutral', icon: 'tests' }
  }
  if (tests.some((test) => test.status === 'draft')) {
    return { label: copy.statusDraft, tone: 'warning', icon: 'drafts' }
  }
  return { label: copy.statusPublished, tone: 'success', icon: 'check' }
}

function Frame({ children }: { children: React.ReactNode }) {
  const copy = useStrings().classes
  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />
      {children}
    </div>
  )
}