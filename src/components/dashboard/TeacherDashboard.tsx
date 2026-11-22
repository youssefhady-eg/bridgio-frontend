import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  sessionQueryOptions,
  teacherDashboardQueryOptions,
  teacherTestsQueryOptions,
} from '~/api/queries'
import type { StudentProgressSnapshot } from '~/api/types'
import { dashboardLabel } from '~/content/roles'
import { useGuestPreview } from '~/shell/useGuestPreview'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'
import { formatCount, formatDate, formatPercent } from './format'
import { PublishTestButton } from '~/components/teacher/PublishTestButton'
import { StudentDrawer } from '~/components/teacher/StudentDrawer'
import { masteryTone } from '~/components/teacher/tones'
import {
  EmptyBox,
  Kpi,
  LoadingNote,
  MasteryBar,
  PageHead,
  Panel,
  PanelHead,
  Status,
} from '~/components/teacher/ui'

/**
 * Part 2 (2026-11-22) — teacher dashboard, rebuilt on the demo composition.
 *
 * Every value comes from the adapter: `teachers.getDashboard` for the KPIs, the
 * at-risk rows, unit mastery and submissions, and `tests.listForTeacher` for the
 * full draft list (the dashboard aggregate only carries the five most recent
 * tests, which is not enough to list every draft).
 *
 * NOTHING here computes a score, a mastery percentage or a class average: those
 * are backend aggregates (`averageMasteryPercent`, `atRiskCount`, `unitsDone`,
 * `unitMastery`, `scorePercent`). A null aggregate renders as unavailable.
 *
 * Held (Phase 4): grading. The third KPI is the submissions count (its label
 * lives in the strings file), the submissions table has no action column, and
 * there is no "open grading" or "item analysis" entry point.
 */
export function TeacherDashboard() {
  const sessionQuery = useQuery(sessionQueryOptions())
  const guest = useGuestPreview()
  const strings = useStrings()
  const copy = strings.dashboard
  const lang = useLang()
  const role = usePreviewRole()
  const [classId, setClassId] = useState('all')
  const [drawerStudent, setDrawerStudent] =
    useState<StudentProgressSnapshot | null>(null)

  // A real session always wins; with no session, the guest preview borrows the
  // matching demo identity for reads. This is UI state, never a login.
  const sessionUser = sessionQuery.data?.user ?? guest.user
  const teacherId = sessionUser?.role === 'teacher' ? sessionUser.id : null
  const heading = sessionUser
    ? dashboardLabel(sessionUser, copy)
    : copy.title

  const dashboardQuery = useQuery({
    ...teacherDashboardQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })
  const testsQuery = useQuery({
    ...teacherTestsQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })

  if (sessionQuery.isPending || (teacherId !== null && dashboardQuery.isPending)) {
    return (
      <Frame title={heading}>
        <LoadingNote>{copy.loading}</LoadingNote>
      </Frame>
    )
  }

  if (sessionQuery.isError || dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <Frame title={heading}>
        <EmptyBox
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  if (teacherId === null) {
    return (
      <Frame title={heading}>
        <EmptyBox title={copy.noSessionTitle} body={copy.noSessionBody} />
      </Frame>
    )
  }

  const data = dashboardQuery.data
  const filterActive = classId !== 'all'
  const selectedClass = data.classes.find((item) => item.id === classId)

  const rows = filterActive
    ? data.studentProgress.filter((row) => row.classroomId === classId)
    : data.studentProgress
  const atRisk = [...rows]
    .sort((left, right) => left.progressPercent - right.progressPercent)
    .slice(0, 5)

  const studentCount = filterActive
    ? (selectedClass?.studentCount ?? 0)
    : data.totals.students
  const masteryPercent = filterActive
    ? (data.averageMasteryByClass.find((item) => item.classroomId === classId)
        ?.averageMasteryPercent ?? null)
    : data.averageMasteryPercent
  const atRiskCount = filterActive
    ? (selectedClass?.atRiskCount ?? 0)
    : data.atRiskCount

  const drafts = (testsQuery.data ?? []).filter(
    (test) =>
      test.status === 'draft' && (!filterActive || test.classroomId === classId),
  )

  return (
    <Frame
      title={heading}
      actions={
        <>
          <select
            className="tv-select"
            aria-label={copy.filterLabel}
            value={classId}
            onChange={(event) => setClassId(event.target.value)}
          >
            <option value="all">
              {copy.allClassesCount(formatCount(data.totals.students, lang))}
            </option>
            {data.classes.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
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
      <section className="tv-kpi-grid" aria-label={copy.totals.label}>
        <Kpi
          label={copy.kpi.students}
          value={formatCount(studentCount, lang)}
          meta={
            filterActive
              ? (selectedClass?.subjectName ?? copy.atRisk.classLabel)
              : copy.kpi.studentsMeta(formatCount(data.classes.length, lang))
          }
        />
        <Kpi
          label={copy.kpi.mastery}
          value={
            masteryPercent === null
              ? copy.unavailable
              : formatPercent(masteryPercent, lang)
          }
          meta={
            masteryPercent === null
              ? undefined
              : masteryPercent >= 70
                ? copy.kpi.masteryOnTarget
                : copy.kpi.masteryNeedsSupport
          }
          metaTone={
            masteryPercent === null
              ? undefined
              : masteryPercent >= 70
                ? 'success'
                : 'warning'
          }
        />
        <Kpi
          label={copy.kpi.submissions}
          value={formatCount(data.submittedAttemptsCount, lang)}
          meta={
            data.scoredSubmissionsCount === 0
              ? copy.kpi.submissionsNone
              : copy.kpi.submissionsScored(
                  formatCount(data.scoredSubmissionsCount, lang),
                )
          }
        />
        <Kpi
          label={copy.kpi.atRisk}
          value={formatCount(atRiskCount, lang)}
          meta={copy.kpi.atRiskMeta}
          metaTone="danger"
        />
      </section>

      <div className="tv-grid-2">
        <Panel labelledBy="dashboard-at-risk">
          <PanelHead
            id="dashboard-at-risk"
            title={copy.atRisk.heading}
            count={formatCount(atRisk.length, lang)}
          >
            <Link
              to="/teacher/students"
              search={{ as: role, lang }}
              className="tv-btn tv-btn-ghost tv-btn-sm"
              preload={false}
            >
              {copy.atRisk.viewAll(formatCount(rows.length, lang))}
            </Link>
          </PanelHead>
          {atRisk.length === 0 ? (
            <EmptyBox
              title={copy.atRisk.emptyTitle}
              body={copy.atRisk.emptyBody}
            />
          ) : (
            <div className="tv-table-wrap">
              <table className="tv-table">
                <caption className="visually-hidden">
                  {copy.atRisk.heading}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{copy.atRisk.student}</th>
                    <th scope="col">{copy.atRisk.classLabel}</th>
                    <th scope="col">{copy.atRisk.mastery}</th>
                    <th scope="col">{copy.atRisk.lastScore}</th>
                    <th scope="col">{copy.atRisk.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {atRisk.map((row) => (
                    <tr key={`${row.student.id}:${row.classroomId}`}>
                      <td className="tv-td-primary">
                        <div className="tv-cell-title">
                          {row.student.displayName}
                        </div>
                        <div className="tv-cell-sub">
                          {copy.atRisk.lastActive(
                            formatDate(
                              row.lastActiveAt,
                              copy.progress.noActivity,
                              lang,
                            ),
                          )}
                        </div>
                      </td>
                      <td data-label={copy.atRisk.classLabel}>
                        {row.classroomName}
                      </td>
                      <td data-label={copy.atRisk.mastery}>
                        <MasteryBar
                          percent={row.progressPercent}
                          label={copy.progress.barLabel(row.student.displayName)}
                        />
                      </td>
                      <td data-label={copy.atRisk.lastScore} className="tv-num">
                        {row.lastScorePercent === null
                          ? copy.unavailable
                          : formatPercent(row.lastScorePercent, lang)}
                      </td>
                      <td data-label={copy.atRisk.action}>
                        <div className="tv-actions-cell">
                          <button
                            type="button"
                            className="tv-btn tv-btn-subtle tv-btn-sm"
                            onClick={() => setDrawerStudent(row)}
                          >
                            {copy.atRisk.followUp}
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

        <div className="tv-stack">
          <Panel labelledBy="dashboard-units">
            <PanelHead id="dashboard-units" title={copy.units.heading} />
            <div className="tv-panel-body">
              {data.unitMastery.length === 0 ? (
                <EmptyBox
                  title={copy.units.emptyTitle}
                  body={copy.units.emptyBody}
                />
              ) : (
                <div className="tv-stack-sm">
                  {data.unitMastery.map((unit) => (
                    <div key={unit.unitId} className="tv-stack-sm">
                      <div className="tv-kpi-row">
                        <span>{unit.unitName}</span>
                        <strong
                          className="tv-num"
                          style={{
                            color: `var(--status-${masteryTone(unit.masteryPercent)})`,
                          }}
                        >
                          {formatPercent(unit.masteryPercent, lang)}
                        </strong>
                      </div>
                      <div
                        className="tv-bar-track"
                        role="progressbar"
                        aria-label={copy.units.barLabel(unit.unitName)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={unit.masteryPercent}
                      >
                        <div
                          className="tv-bar-fill"
                          data-tone={masteryTone(unit.masteryPercent)}
                          style={{ width: `${unit.masteryPercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Panel>

          <Panel labelledBy="dashboard-drafts">
            <PanelHead
              id="dashboard-drafts"
              title={copy.drafts.heading}
              count={formatCount(drafts.length, lang)}
            />
            <div className="tv-table-wrap">
              <table className="tv-table">
                <caption className="visually-hidden">
                  {copy.drafts.heading}
                </caption>
                <tbody>
                  {drafts.length === 0 ? (
                    <tr>
                      <td className="tv-empty-cell" colSpan={2}>
                        {copy.drafts.empty}
                      </td>
                    </tr>
                  ) : (
                    drafts.map((test) => (
                      <tr key={test.id}>
                        <td className="tv-td-primary">
                          <div className="tv-cell-title">{test.title}</div>
                          <div className="tv-cell-sub">
                            {copy.drafts.meta(
                              test.classroomName,
                              copy.drafts.questionsCount(test.questionCount),
                            )}
                          </div>
                        </td>
                        <td data-label={copy.atRisk.action}>
                          <div className="tv-actions-cell">
                            <Link
                              to="/teacher/tests/$testId"
                              params={{ testId: test.id }}
                              search={{ as: role, lang }}
                              className="tv-btn tv-btn-subtle tv-btn-sm"
                              preload={false}
                            >
                              {copy.drafts.edit}
                            </Link>
                            <PublishTestButton
                              teacherId={teacherId}
                              test={test}
                              labels={{
                                publish: copy.drafts.publish,
                                publishing: copy.drafts.publishing,
                                error: copy.drafts.publishError,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>

      <Panel labelledBy="dashboard-submissions">
        <PanelHead
          id="dashboard-submissions"
          title={copy.submissions.heading}
          count={formatCount(data.recentSubmissions.length, lang)}
        />
        {data.recentSubmissions.length === 0 ? (
          <EmptyBox
            title={copy.submissions.emptyTitle}
            body={copy.submissions.emptyBody}
          />
        ) : (
          <div className="tv-table-wrap">
            <table className="tv-table">
              <caption className="visually-hidden">
                {copy.submissions.heading}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{copy.submissions.student}</th>
                  <th scope="col">{copy.submissions.test}</th>
                  <th scope="col">{copy.submissions.submittedAt}</th>
                  <th scope="col">{copy.submissions.score}</th>
                </tr>
              </thead>
              <tbody>
                {data.recentSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="tv-td-primary">
                      <div className="tv-cell-title">
                        {submission.studentName}
                      </div>
                    </td>
                    <td data-label={copy.submissions.test}>
                      {submission.testTitle}
                    </td>
                    <td
                      data-label={copy.submissions.submittedAt}
                      className="tv-cell-sub"
                    >
                      {formatDate(
                        submission.submittedAt,
                        copy.tests.unknownDate,
                        lang,
                      )}
                    </td>
                    <td data-label={copy.submissions.score} className="tv-num">
                      {submission.scorePercent === null ? (
                        <Status tone="neutral">
                          {copy.submissions.scoreUnavailable}
                        </Status>
                      ) : (
                        formatPercent(submission.scorePercent, lang)
                      )}
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