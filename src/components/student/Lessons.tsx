import { useQueries, useQuery } from '@tanstack/react-query'
import {
  classroomDetailQueryOptions,
  sessionQueryOptions,
  studentProfileQueryOptions,
  studentProgressQueryOptions,
} from '~/api/queries'
import type { StudentProgress } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { ProgressBar } from '~/components/dashboard/ProgressBar'
import { formatCount, formatPercent } from '~/components/dashboard/format'
import { MetaPair } from '~/components/shared/MetaPair'
import { MetaSep } from '~/components/shared/MetaSep'
import { PageHero } from '~/components/shared/PageHero'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Student "Lessons" — the units of each enrolled class and their lessons.
 *
 * The class list comes from `students.getProfile`, the unit progress from
 * `students.getProgress` per class and the class names from `classrooms.get`
 * (all PROPOSED). Progress values are backend-supplied; no lesson content is
 * invented because the contract exposes lesson counts, not lesson bodies.
 */
export function Lessons() {
  const strings = useStrings()
  const copy = strings.lessons
  const lang = useLang()

  const sessionQuery = useQuery(sessionQueryOptions())
  const studentId =
    sessionQuery.data?.user.role === 'student'
      ? sessionQuery.data.user.id
      : null

  const profileQuery = useQuery({
    ...studentProfileQueryOptions(studentId ?? ''),
    enabled: studentId !== null,
  })

  const classroomIds = profileQuery.data?.classroomIds ?? []

  const detailQueries = useQueries({
    queries: classroomIds.map((classroomId) =>
      classroomDetailQueryOptions(classroomId),
    ),
  })
  const progressQueries = useQueries({
    queries: classroomIds.map((classroomId) =>
      studentProgressQueryOptions(studentId ?? '', classroomId),
    ),
  })

  if (sessionQuery.isPending || sessionQuery.isError) {
    return (
      <Frame>
        {sessionQuery.isError ? (
          <EmptyNote
            tone="error"
            title={copy.loadErrorTitle}
            body={copy.loadErrorBody}
          />
        ) : (
          <p className="loading-note" role="status">
            {copy.loading}
          </p>
        )}
      </Frame>
    )
  }

  if (studentId === null) {
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

  const loading =
    profileQuery.isPending ||
    detailQueries.some((query) => query.isPending) ||
    progressQueries.some((query) => query.isPending)

  if (loading) {
    return (
      <Frame>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (profileQuery.isError || progressQueries.some((query) => query.isError)) {
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

  const classes: { id: string; name: string; progress: StudentProgress }[] = []
  classroomIds.forEach((classroomId, index) => {
    const progress = progressQueries[index]?.data
    if (!progress || progress.units.length === 0) return
    classes.push({
      id: classroomId,
      name: detailQueries[index]?.data?.name ?? '',
      progress,
    })
  })

  return (
    <Frame>
      {classes.length === 0 ? (
        <EmptyNote
          icon="book"
          title={copy.emptyTitle}
          body={copy.emptyBody}
        />
      ) : (
        classes.map((entry) => (
          <section
            className="dashboard__section"
            key={entry.id}
            aria-labelledby={`lessons-${entry.id}`}
          >
            <div className="section-head">
              <h2 id={`lessons-${entry.id}`}>{entry.name}</h2>
              <span className="count-chip">
                {formatCount(entry.progress.units.length, lang)}
              </span>
            </div>
            <p className="section-lead">
              {copy.classLabel}: {entry.name}
            </p>
            <ul className="parent-unit-list">
              {entry.progress.units.map((unit) => (
                <li className="parent-unit" key={unit.unit.id}>
                  <div className="parent-unit__head">
                    <h3>{unit.unit.title}</h3>
                    <div className="parent-score">
                      <span className="parent-score__label">
                        {copy.progressLabel}
                      </span>
                      <strong>{formatPercent(unit.progressPercent, lang)}</strong>
                    </div>
                  </div>
                  <ProgressBar
                    percent={unit.progressPercent}
                    label={copy.barLabel(unit.unit.title)}
                    valueText={formatPercent(unit.progressPercent, lang)}
                  />
                  <p className="row-meta">
                    {copy.lessonsCount(unit.unit.lessonCount)}
                    <MetaSep />
                    <MetaPair label={copy.completedLabel}>
                      {formatCount(unit.lessonsCompleted, lang)}
                    </MetaPair>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </Frame>
  )
}

function Frame({ children }: { children: React.ReactNode }) {
  const copy = useStrings().lessons
  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />
      {children}
    </div>
  )
}
