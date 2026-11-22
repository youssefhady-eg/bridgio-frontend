import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { sessionQueryOptions, teacherDashboardQueryOptions } from '~/api/queries'
import type { StudentProgressSnapshot } from '~/api/types'
import { useGuestPreview } from '~/shell/useGuestPreview'
import { useLang, useStrings } from '~/shell/useStrings'
import { formatCount, formatDate, formatPercent } from '~/components/dashboard/format'
import { normaliseSearchText } from './question-bank'
import { dedupeByStudent } from './students'
import { StudentDrawer } from './StudentDrawer'
import { EmptyBox, LoadingNote, MasteryBar, PageHead, Panel } from './ui'

/**
 * Part 2 (2026-11-22) — teacher students, rebuilt as a filtered table with a
 * student drawer.
 *
 * Rows are the dashboard aggregate's `studentProgress` (PROPOSED), one row per
 * enrolment. A student in two classes appears twice there and once here: the
 * screen keeps the enrolment that needs attention most (lowest progress) and
 * shows that class, so the table is one row per student.
 *
 * The drawer is `StudentDrawer`; there is no student detail page in this table's
 * path. Mastery and last score are backend values.
 */
export function StudentList() {
  const sessionQuery = useQuery(sessionQueryOptions())
  const guest = useGuestPreview()
  const copy = useStrings().students
  const lang = useLang()
  const [search, setSearch] = useState('')
  const [classId, setClassId] = useState('all')
  const [drawerStudent, setDrawerStudent] =
    useState<StudentProgressSnapshot | null>(null)

  const sessionUser = sessionQuery.data?.user ?? guest.user
  const teacherId = sessionUser?.role === 'teacher' ? sessionUser.id : null

  const dashboardQuery = useQuery({
    ...teacherDashboardQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })

  if (
    sessionQuery.isPending ||
    (teacherId !== null && dashboardQuery.isPending)
  ) {
    return (
      <Frame title={copy.title}>
        <LoadingNote>{copy.loading}</LoadingNote>
      </Frame>
    )
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
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

  const data = dashboardQuery.data
  const query = normaliseSearchText(search)
  const rows = dedupeByStudent(
    data.studentProgress.filter(
      (row) =>
        (classId === 'all' || row.classroomId === classId) &&
        (query === '' ||
          normaliseSearchText(row.student.displayName).includes(query)),
    ),
  )

  return (
    <Frame
      title={`${copy.title} ${copy.countLabel(formatCount(rows.length, lang))}`}
      actions={
        <>
          <input
            className="tv-input"
            type="search"
            aria-label={copy.searchLabel}
            placeholder={copy.searchPlaceholder}
            style={{ width: '220px' }}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {data.classes.length > 0 ? (
            <select
              className="tv-select"
              aria-label={copy.filterClass}
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
            >
              <option value="all">{copy.allClasses}</option>
              {data.classes.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </select>
          ) : null}
        </>
      }
    >
      <Panel>
        {data.studentProgress.length === 0 ? (
          <EmptyBox title={copy.emptyTitle} body={copy.emptyBody} />
        ) : rows.length === 0 ? (
          <EmptyBox title={copy.noMatchTitle} body={copy.noMatchBody} />
        ) : (
          <div className="tv-table-wrap">
            <table className="tv-table">
              <caption className="visually-hidden">{copy.title}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.colStudent}</th>
                  <th scope="col">{copy.colClass}</th>
                  <th scope="col">{copy.colMastery}</th>
                  <th scope="col">{copy.colLastScore}</th>
                  <th scope="col">{copy.colLastActive}</th>
                  <th scope="col">{copy.colAction}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.student.id}>
                    <td className="tv-td-primary">
                      <div className="tv-cell-title">
                        {row.student.displayName}
                      </div>
                    </td>
                    <td data-label={copy.colClass}>{row.classroomName}</td>
                    <td data-label={copy.colMastery}>
                      <MasteryBar
                        percent={row.progressPercent}
                        label={copy.progressLabel}
                      />
                    </td>
                    <td data-label={copy.colLastScore} className="tv-num">
                      {row.lastScorePercent === null
                        ? copy.scoreUnavailable
                        : formatPercent(row.lastScorePercent, lang)}
                    </td>
                    <td data-label={copy.colLastActive} className="tv-cell-sub">
                      {formatDate(row.lastActiveAt, copy.noActivity, lang)}
                    </td>
                    <td data-label={copy.colAction}>
                      <div className="tv-actions-cell">
                        <button
                          type="button"
                          className="tv-btn tv-btn-subtle tv-btn-sm"
                          onClick={() => setDrawerStudent(row)}
                        >
                          {copy.openFile}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {drawerStudent ? (
        <StudentDrawer
          studentId={drawerStudent.student.id}
          studentName={drawerStudent.student.displayName}
          classroomName={drawerStudent.classroomName}
          masteryPercent={drawerStudent.progressPercent}
          lastScorePercent={drawerStudent.lastScorePercent}
          lastActiveAt={drawerStudent.lastActiveAt}
          onClose={() => setDrawerStudent(null)}
        />
      ) : null}
    </Frame>
  )
}

/** Page scaffold: the demo's page head above one column of panels. */
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