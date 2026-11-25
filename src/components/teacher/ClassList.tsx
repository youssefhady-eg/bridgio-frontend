import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { sessionQueryOptions, teacherClassroomsQueryOptions } from '~/api/queries'
import { EmptyBox, LoadingNote, PageHead, Panel, PanelHead, Status } from './ui'
import { useGuestPreview } from '~/shell/useGuestPreview'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'
import { formatCount, formatPercent } from '~/components/dashboard/format'
import { masteryTone } from './tones'

/**
 * Part 2 (2026-11-22) — teacher classes, rebuilt as class cards.
 *
 * The card is the demo's composition: name and average mastery in the head, one
 * subject/units line, an inset pair (students, students needing follow-up) and
 * two real destinations — the student list and the test list.
 *
 * `averageMasteryPercent`, `atRiskCount` and `unitsDone` are backend aggregates
 * (PROPOSED Part 2). An empty class has a null average and shows the
 * no-students note rather than 0%.
 */
export function ClassList() {
  const sessionQuery = useQuery(sessionQueryOptions())
  const guest = useGuestPreview()
  const strings = useStrings()
  const copy = strings.classes
  const lang = useLang()
  const role = usePreviewRole()

  const sessionUser = sessionQuery.data?.user ?? guest.user
  const teacherId = sessionUser?.role === 'teacher' ? sessionUser.id : null

  const classesQuery = useQuery({
    ...teacherClassroomsQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
  })

  if (sessionQuery.isPending || (teacherId !== null && classesQuery.isPending)) {
    return (
      <Frame title={copy.title}>
        <LoadingNote>{copy.loading}</LoadingNote>
      </Frame>
    )
  }

  if (classesQuery.isError) {
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

  return (
    <Frame
      title={copy.title}
      actions={
        <Link
          to="/teacher/tests/new"
          search={{ as: role, lang }}
          className="tv-btn tv-btn-primary"
          preload={false}
        >
          {copy.newTest}
        </Link>
      }
    >
      {classes.length === 0 ? (
        <Panel>
          <EmptyBox title={copy.emptyTitle} body={copy.emptyBody} />
        </Panel>
      ) : (
        <div className="tv-grid-3">
          {classes.map((classroom) => (
            <Panel key={classroom.id}>
              <PanelHead title={classroom.name}>
                <Status
                  tone={
                    classroom.averageMasteryPercent === null
                      ? 'neutral'
                      : masteryTone(classroom.averageMasteryPercent)
                  }
                >
                  {classroom.averageMasteryPercent === null
                    ? copy.masteryUnavailable
                    : copy.averageBadge(
                        formatPercent(classroom.averageMasteryPercent, lang),
                      )}
                </Status>
              </PanelHead>
              <div className="tv-panel-body tv-stack-sm">
                <div className="tv-cell-sub">
                  {copy.subjectUnits(
                    classroom.subjectName,
                    formatCount(classroom.unitsDone, lang),
                    formatCount(classroom.unitCount, lang),
                  )}
                </div>

                <div className="tv-grid-equal">
                  <div className="tv-kpi">
                    <span className="tv-kpi-label">{copy.students}</span>
                    <strong className="tv-num">
                      {formatCount(classroom.studentCount, lang)}
                    </strong>
                  </div>
                  <div className="tv-kpi">
                    <span className="tv-kpi-label">{copy.atRisk}</span>
                    <strong
                      className="tv-num"
                      style={{
                        color:
                          classroom.atRiskCount > 0
                            ? 'var(--status-danger)'
                            : 'var(--status-success)',
                      }}
                    >
                      {formatCount(classroom.atRiskCount, lang)}
                    </strong>
                  </div>
                </div>

                <div className="tv-page-actions">
                  <Link
                    to="/teacher/students"
                    search={{ as: role, lang }}
                    className="tv-btn tv-btn-subtle tv-btn-sm"
                    preload={false}
                  >
                    {copy.studentsList}
                  </Link>
                  <Link
                    to="/teacher/tests"
                    search={{ as: role, lang }}
                    className="tv-btn tv-btn-secondary tv-btn-sm"
                    preload={false}
                  >
                    {copy.testsButton}
                  </Link>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
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