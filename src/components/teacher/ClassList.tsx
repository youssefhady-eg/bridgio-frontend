import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  teacherClassroomsQueryOptions,
} from '~/api/queries'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { formatCount } from '~/components/dashboard/format'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Teacher "My Classes" — the full class list. It reads the teacher's classes
 * through `classrooms.listForTeacher` (PROPOSED) and links each card to the
 * class detail screen. No value is invented: counts come from the adapter.
 */
export function ClassList() {
  const strings = useStrings()
  const copy = strings.classes
  const lang = useLang()
  const role = usePreviewRole()

  const sessionQuery = useQuery(sessionQueryOptions())
  const teacherId =
    sessionQuery.data?.user.role === 'teacher'
      ? sessionQuery.data.user.id
      : null

  const classesQuery = useQuery({
    ...teacherClassroomsQueryOptions(teacherId ?? ''),
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

  if (classesQuery.isPending) {
    return (
      <Frame>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (classesQuery.isError || !classesQuery.data) {
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
          <ul className="class-grid">
            {classes.map((classroom) => (
              <li className="class-card" key={classroom.id}>
                <h3>{classroom.name}</h3>
                <p className="row-meta">
                  {classroom.subjectName} · {classroom.gradeLevel}
                </p>
                <dl className="class-card__stats">
                  <div>
                    <dt>{copy.students}</dt>
                    <dd>{formatCount(classroom.studentCount, lang)}</dd>
                  </div>
                  <div>
                    <dt>{copy.units}</dt>
                    <dd>{formatCount(classroom.unitCount, lang)}</dd>
                  </div>
                  <div>
                    <dt>{copy.lessons}</dt>
                    <dd>{formatCount(classroom.lessonCount, lang)}</dd>
                  </div>
                </dl>
                {classroom.certificateNote ? (
                  <p className="class-card__note">{classroom.certificateNote}</p>
                ) : null}
                <p className="finish-actions">
                  <Link
                    to="/teacher/classes/$classId"
                    params={{ classId: classroom.id }}
                    search={{ as: role, lang }}
                    className="button button--secondary button--small"
                    preload={false}
                  >
                    {copy.open}
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Frame>
  )
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
