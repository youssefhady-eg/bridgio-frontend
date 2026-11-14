import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Fragment, type ReactNode } from 'react'
import {
  sessionQueryOptions,
  studentProfileQueryOptions,
  studentProgressQueryOptions,
  teacherClassroomsQueryOptions,
} from '~/api/queries'
import { isApiError } from '~/api/errors'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { ProgressBar } from '~/components/dashboard/ProgressBar'
import { formatCount, formatDate, formatPercent } from '~/components/dashboard/format'
import { MetaList } from '~/components/shared/MetaList'
import { MetaPair } from '~/components/shared/MetaPair'
import { MetaSep } from '~/components/shared/MetaSep'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Teacher student detail — a student's enrollment and progress across units.
 *
 * The profile comes from `students.getProfile`, the progress from
 * `students.getProgress` and the class names from `classrooms.listForTeacher`
 * (all PROPOSED). Progress is backend-supplied; this screen computes no score
 * and no grade, and shows no per-test result (the contract exposes none).
 */
export function StudentDetail({ studentId }: { studentId: string }) {
  const strings = useStrings()
  const copy = strings.students.detail
  const lang = useLang()
  const role = usePreviewRole()

  const sessionQuery = useQuery(sessionQueryOptions())
  const teacherId =
    sessionQuery.data?.user.role === 'teacher'
      ? sessionQuery.data.user.id
      : null

  const profileQuery = useQuery(studentProfileQueryOptions(studentId))
  const progressQuery = useQuery(studentProgressQueryOptions(studentId))
  const classesQuery = useQuery({
    ...teacherClassroomsQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })

  if (profileQuery.isPending || progressQuery.isPending) {
    return (
      <Frame title={strings.nav['teacher-students']}>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (profileQuery.isError || progressQuery.isError) {
    const notFound =
      isApiError(profileQuery.error) && profileQuery.error.code === 'NOT_FOUND'
    return (
      <Frame title={strings.nav['teacher-students']}>
        <EmptyNote
          tone={notFound ? 'neutral' : 'error'}
          icon={notFound ? 'alert' : undefined}
          title={notFound ? copy.notFoundTitle : copy.loadErrorTitle}
          body={notFound ? copy.notFoundBody : copy.loadErrorBody}
        />
      </Frame>
    )
  }

  const profile = profileQuery.data
  const progress = progressQuery.data
  if (!profile || !progress) {
    return (
      <Frame title={strings.nav['teacher-students']}>
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  const classNameById = new Map(
    (classesQuery.data ?? []).map((classroom) => [classroom.id, classroom.name]),
  )
  const classNames = profile.classroomIds
    .map((id) => classNameById.get(id))
    .filter((name): name is string => Boolean(name))

  return (
    <Frame
      title={profile.user.displayName}
      greeting={
        classNames.length > 0 ? (
          <MetaPair label={copy.classLabel}>
            {separatedClassNames(classNames)}
          </MetaPair>
        ) : (
          profile.gradeLevel
        )
      }
    >
      <MetaList
        items={[
          {
            label: copy.overallLabel,
            value: formatPercent(progress.overallPercent, lang),
          },
          {
            label: copy.classLabel,
            value:
              classNames.length > 0
                ? separatedClassNames(classNames)
                : profile.gradeLevel,
          },
          {
            label: copy.lastActive,
            value: formatDate(progress.lastActiveAt, copy.noActivity, lang),
          },
        ]}
      />

      <section className="dashboard__section" aria-labelledby="student-units-heading">
        <div className="section-head">
          <h2 id="student-units-heading">{copy.unitsHeading}</h2>
          <span className="count-chip">
            {formatCount(progress.units.length, lang)}
          </span>
        </div>
        <p className="section-lead">{copy.unitsLead}</p>
        {progress.units.length === 0 ? (
          <EmptyNote
            icon="book"
            title={copy.emptyTitle}
            body={copy.emptyBody}
          />
        ) : (
          <ul className="parent-unit-list">
            {progress.units.map((entry) => (
              <li className="parent-unit" key={entry.unit.id}>
                <div className="parent-unit__head">
                  <h3>{entry.unit.title}</h3>
                  <div className="parent-score">
                    <span className="parent-score__label">
                      {strings.students.progressLabel}
                    </span>
                    <strong>{formatPercent(entry.progressPercent, lang)}</strong>
                  </div>
                </div>
                <ProgressBar
                  percent={entry.progressPercent}
                  label={copy.barLabel(entry.unit.title)}
                  valueText={formatPercent(entry.progressPercent, lang)}
                />
                <p className="row-meta">
                  <MetaPair label={copy.lessonsCompleted}>
                    {formatCount(entry.lessonsCompleted, lang)}
                  </MetaPair>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Frame>
  )
}

function Frame({
  title,
  greeting,
  children,
}: {
  title: string
  greeting?: ReactNode
  children: ReactNode
}) {
  const strings = useStrings()
  const role = usePreviewRole()
  const lang = useLang()
  return (
    <div className="dashboard">
      <Link
        to="/teacher/students"
        search={{ as: role, lang }}
        className="page-back"
        preload={false}
      >
        {strings.students.detail.back}
      </Link>
      <PageHero
        badge={strings.students.badge}
        title={title}
        footer={
          greeting ? <p className="dashboard__greeting">{greeting}</p> : undefined
        }
      />
      {children}
    </div>
  )
}

/**
 * Class names interleaved with a middle-dot element. The dot used to come from
 * `classNames.join(' · ')`, where the surrounding spaces can collapse at a
 * text-node boundary in RTL.
 */
function separatedClassNames(classNames: readonly string[]): ReactNode {
  return classNames.map((name, index) => (
    <Fragment key={`${name}:${index}`}>
      {index > 0 ? <MetaSep /> : null}
      {name}
    </Fragment>
  ))
}
