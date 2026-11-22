import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  sessionQueryOptions,
  teacherClassroomsQueryOptions,
  teacherTestsQueryOptions,
} from '~/api/queries'
import { useGuestPreview } from '~/shell/useGuestPreview'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'
import { formatCount, formatDate } from '~/components/dashboard/format'
import { PublishTestButton } from './PublishTestButton'
import { EmptyBox, LoadingNote, PageHead, Panel, Status } from './ui'

/**
 * Part 2 (2026-11-22) — teacher test list at `/teacher/tests`.
 *
 * The tests come from `tests.listForTeacher` and the filter options from
 * `classrooms.listForTeacher`; both are teacher-scoped in the adapter. The row
 * shows the class-configured duration the adapter supplies (or "—" when the
 * test has none) and no release-mode sub-line, per the Part 2 brief.
 *
 * Grading is held (Phase 4): there is no "correct" action. A draft offers edit
 * and publish; a published test offers preview (its read-only detail screen).
 */
export function TestsList() {
  const sessionQuery = useQuery(sessionQueryOptions())
  const guest = useGuestPreview()
  const copy = useStrings().testsList
  const lang = useLang()
  const role = usePreviewRole()
  const [classId, setClassId] = useState('all')

  const sessionUser = sessionQuery.data?.user ?? guest.user
  const teacherId = sessionUser?.role === 'teacher' ? sessionUser.id : null

  const testsQuery = useQuery({
    ...teacherTestsQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })
  const classesQuery = useQuery({
    ...teacherClassroomsQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })

  if (sessionQuery.isPending) {
    return (
      <Frame title={copy.title}>
        <LoadingNote>{copy.loading}</LoadingNote>
      </Frame>
    )
  }

  if (teacherId === null) {
    return (
      <Frame title={copy.title}>
        <EmptyBox title={copy.noSessionTitle} body={copy.noSessionBody} />
      </Frame>
    )
  }

  if (testsQuery.isError) {
    return (
      <Frame title={copy.title}>
        <EmptyBox
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  const classes = classesQuery.data ?? []
  const tests = testsQuery.data ?? []
  const visible =
    classId === 'all'
      ? tests
      : tests.filter((test) => test.classroomId === classId)

  return (
    <Frame
      title={copy.title}
      actions={
        <>
          {classes.length > 0 ? (
            <select
              className="tv-select"
              aria-label={copy.filterLabel}
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
            >
              <option value="all">{copy.allClasses}</option>
              {classes.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </select>
          ) : null}
          <Link
            to="/teacher/tests/new"
            search={{ as: role, lang }}
            className="tv-btn tv-btn-primary"
            preload={false}
          >
            {copy.newTest}
          </Link>
        </>
      }
    >
      <Panel>
        {testsQuery.isPending ? (
          <LoadingNote>{copy.loading}</LoadingNote>
        ) : visible.length === 0 ? (
          <EmptyBox
            title={tests.length === 0 ? copy.emptyTitle : copy.filteredEmptyTitle}
            body={tests.length === 0 ? copy.emptyBody : copy.filteredEmptyBody}
          />
        ) : (
          <div className="tv-table-wrap">
            <table className="tv-table">
              <caption className="visually-hidden">{copy.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.colTest}</th>
                  <th scope="col">{copy.colClass}</th>
                  <th scope="col">{copy.colQuestions}</th>
                  <th scope="col">{copy.colDuration}</th>
                  <th scope="col">{copy.colStatus}</th>
                  <th scope="col">{copy.colUpdated}</th>
                  <th scope="col">{copy.colAction}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((test) => {
                  const published = test.status === 'published'
                  return (
                    <tr key={test.id}>
                      <td className="tv-td-primary">
                        <div className="tv-cell-title">{test.title}</div>
                      </td>
                      <td data-label={copy.colClass}>{test.classroomName}</td>
                      <td data-label={copy.colQuestions} className="tv-num">
                        {formatCount(test.questionCount, lang)}
                      </td>
                      <td data-label={copy.colDuration} className="tv-num">
                        {test.durationMinutes === null
                          ? copy.noDuration
                          : copy.minutes(formatCount(test.durationMinutes, lang))}
                      </td>
                      <td data-label={copy.colStatus}>
                        <Status tone={published ? 'success' : 'warning'}>
                          {published ? copy.statusPublished : copy.statusDraft}
                        </Status>
                      </td>
                      <td data-label={copy.colUpdated} className="tv-cell-sub">
                        {formatDate(test.updatedAt, copy.unknownDate, lang)}
                      </td>
                      <td data-label={copy.colAction}>
                        <div className="tv-actions-cell">
                          <Link
                            to="/teacher/tests/$testId"
                            params={{ testId: test.id }}
                            search={{ as: role, lang }}
                            className="tv-btn tv-btn-subtle tv-btn-sm"
                            preload={false}
                          >
                            {published ? copy.preview : copy.edit}
                          </Link>
                          {published ? null : (
                            <PublishTestButton
                              teacherId={teacherId}
                              test={test}
                              labels={{
                                publish: copy.publish,
                                publishing: copy.publishing,
                                error: copy.publishErrorTitle,
                              }}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </Frame>
  )
}

function Frame({
  title,
  actions,
  children,
}: {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="tv-page">
      <PageHead title={title}>{actions}</PageHead>
      {children}
    </div>
  )
}