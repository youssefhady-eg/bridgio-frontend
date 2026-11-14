import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import {
  classroomDetailQueryOptions,
  classroomStudentsQueryOptions,
  sessionQueryOptions,
  teacherTestsQueryOptions,
} from '~/api/queries'
import type { TestSummary } from '~/api/types'
import { isApiError } from '~/api/errors'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { ProgressBar } from '~/components/dashboard/ProgressBar'
import { StatusChip } from '~/components/dashboard/StatusChip'
import { formatCount, formatDate, formatPercent } from '~/components/dashboard/format'
import { MetaList } from '~/components/shared/MetaList'
import { MetaPair } from '~/components/shared/MetaPair'
import { MetaSep } from '~/components/shared/MetaSep'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Teacher class detail — units, the class roster and the class's tests.
 *
 * Units and metadata come from `classrooms.get`, the roster from
 * `classrooms.listStudents` and the tests from `tests.listForTeacher` filtered
 * to this class. Every endpoint is PROPOSED; nothing is invented here.
 */
export function ClassDetail({ classId }: { classId: string }) {
  const strings = useStrings()
  const copy = strings.classes.detail
  const navLabel = strings.nav['teacher-classes']
  const lang = useLang()
  const role = usePreviewRole()

  const sessionQuery = useQuery(sessionQueryOptions())
  const teacherId =
    sessionQuery.data?.user.role === 'teacher'
      ? sessionQuery.data.user.id
      : null

  const detailQuery = useQuery(classroomDetailQueryOptions(classId))
  const studentsQuery = useQuery(classroomStudentsQueryOptions(classId))
  const testsQuery = useQuery({
    ...teacherTestsQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })

  if (detailQuery.isPending) {
    return (
      <Frame title={navLabel}>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (detailQuery.isError || !detailQuery.data) {
    const notFound =
      isApiError(detailQuery.error) && detailQuery.error.code === 'NOT_FOUND'
    return (
      <Frame title={navLabel}>
        <EmptyNote
          tone={notFound ? 'neutral' : 'error'}
          icon={notFound ? 'alert' : undefined}
          title={notFound ? copy.notFoundTitle : copy.loadErrorTitle}
          body={notFound ? copy.notFoundBody : copy.loadErrorBody}
        />
      </Frame>
    )
  }

  const classroom = detailQuery.data
  const classTests: TestSummary[] = (testsQuery.data ?? []).filter(
    (test) => test.classroomId === classroom.id,
  )
  const roster = studentsQuery.data ?? []

  return (
    <Frame
      title={classroom.name}
      lead={classroom.description ?? undefined}
      greeting={
        <>
          {classroom.subjectName}
          <MetaSep />
          {classroom.gradeLevel}
        </>
      }
    >
      <MetaList
        items={[
          {
            label: strings.classes.students,
            value: formatCount(classroom.studentCount, lang),
          },
          {
            label: strings.classes.units,
            value: formatCount(classroom.unitCount, lang),
          },
          {
            label: strings.classes.lessons,
            value: formatCount(classroom.lessonCount, lang),
          },
        ]}
      />

      <div className="finish-grid">
        <div className="finish-grid__main">
          <section
            className="dashboard__section"
            aria-labelledby="class-units-heading"
          >
            <div className="section-head">
              <h2 id="class-units-heading">{copy.unitsHeading}</h2>
              <span className="count-chip">
                {formatCount(classroom.units.length, lang)}
              </span>
            </div>
            <p className="section-lead">{copy.unitsLead}</p>
            {classroom.units.length === 0 ? (
              <EmptyNote
                icon="book"
                title={copy.unitsEmptyTitle}
                body={copy.unitsEmptyBody}
              />
            ) : (
              <ul className="class-grid">
                {classroom.units.map((entry) => (
                  <li className="class-card" key={entry.unit.id}>
                    <h3>{entry.unit.title}</h3>
                    {entry.unit.description ? (
                      <p className="row-meta">{entry.unit.description}</p>
                    ) : null}
                    <dl className="class-card__stats">
                      <div>
                        <dt>{strings.classes.lessons}</dt>
                        <dd>{formatCount(entry.unit.lessonCount, lang)}</dd>
                      </div>
                    </dl>
                    <p className="row-meta">
                      {copy.testCount(entry.testCount)}
                    </p>
                    <p className="row-meta">
                      {copy.materialCount(entry.materialCount)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section
            className="dashboard__section"
            aria-labelledby="class-tests-heading"
          >
            <div className="section-head">
              <h2 id="class-tests-heading">{copy.testsHeading}</h2>
              <span className="count-chip">
                {formatCount(classTests.length, lang)}
              </span>
            </div>
            <p className="section-lead">{copy.testsLead}</p>
            {testsQuery.isError ? (
              <EmptyNote
                tone="error"
                title={strings.classes.loadErrorTitle}
                body={strings.classes.loadErrorBody}
              />
            ) : classTests.length === 0 ? (
              <EmptyNote
                icon="tests"
                title={copy.testsEmptyTitle}
                body={copy.testsEmptyBody}
              />
            ) : (
              <div className="panel">
                <ul className="test-list">
                  {classTests.map((test) => {
                    const published = test.status === 'published'
                    return (
                      <li className="test-row" key={test.id}>
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
                          <p className="row-meta">
                            {formatDate(
                              test.updatedAt,
                              strings.testDetail.unknownDate,
                              lang,
                            )}
                          </p>
                        </div>
                        <div className="test-row__aside">
                          <StatusChip
                            tone={published ? 'success' : 'warning'}
                            icon={published ? 'check' : 'pencil'}
                            label={
                              published
                                ? strings.testDetail.statusPublished
                                : strings.testDetail.statusDraft
                            }
                          />
                          <p className="row-meta">
                            <MetaPair label={strings.testDetail.metaQuestions}>
                              {formatCount(test.questionCount, lang)}
                            </MetaPair>
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </section>
        </div>

        <div className="finish-grid__side">
          <section
            className="dashboard__section"
            aria-labelledby="class-roster-heading"
          >
            <div className="section-head">
              <h2 id="class-roster-heading">{copy.rosterHeading}</h2>
              <span className="count-chip">
                {formatCount(roster.length, lang)}
              </span>
            </div>
            <p className="section-lead">{copy.rosterLead}</p>
            {studentsQuery.isError ? (
              <EmptyNote
                tone="error"
                title={copy.rosterError}
                body={strings.classes.detail.loadErrorBody}
              />
            ) : roster.length === 0 ? (
              <EmptyNote
                icon="students"
                title={copy.rosterEmptyTitle}
                body={copy.rosterEmptyBody}
              />
            ) : (
              <div className="panel">
                <ul className="progress-list roster-list">
                  {roster.map((entry) => (
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
                            {entry.student.displayName}
                          </Link>
                        </h3>
                      </div>
                      <div className="progress-row__detail">
                        <div className="progress-row__labels">
                          <span>{strings.students.progressLabel}</span>
                          <strong>
                            {formatPercent(entry.progressPercent, lang)}
                          </strong>
                        </div>
                        <ProgressBar
                          percent={entry.progressPercent}
                          label={strings.dashboard.progress.barLabel(
                            entry.student.displayName,
                          )}
                          valueText={formatPercent(entry.progressPercent, lang)}
                        />
                        <p className="row-meta">
                          <MetaPair label={strings.students.lastActive}>
                            {formatDate(
                              entry.lastActiveAt,
                              strings.students.noActivity,
                              lang,
                            )}
                          </MetaPair>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </Frame>
  )
}

function Frame({
  title,
  lead,
  greeting,
  children,
}: {
  title: string
  lead?: string
  greeting?: ReactNode
  children: ReactNode
}) {
  const strings = useStrings()
  const role = usePreviewRole()
  const lang = useLang()
  return (
    <div className="dashboard">
      <Link
        to="/teacher/classes"
        search={{ as: role, lang }}
        className="page-back"
        preload={false}
      >
        {strings.classes.detail.back}
      </Link>
      <PageHero
        badge={strings.classes.badge}
        title={title}
        lead={lead}
        footer={
          greeting ? <p className="dashboard__greeting">{greeting}</p> : undefined
        }
      />
      {children}
    </div>
  )
}
