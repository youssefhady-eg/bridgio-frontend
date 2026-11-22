import { useQuery } from '@tanstack/react-query'
import { studentAttemptsQueryOptions } from '~/api/queries'
import type { AttemptSummary, UserId } from '~/api/types'
import { formatDate, formatPercent } from '~/components/dashboard/format'
import { useLang, useStrings } from '~/shell/useStrings'
import { scoreBarHeight, scoreText } from './tones'
import { Drawer, EmptyBox, Kpi, LoadingNote } from './ui'

/**
 * Teacher student drawer — one student's mastery, last score and trend.
 *
 * Data: the row the caller already holds (mastery, last score, last active) plus
 * `attempts.listForStudent`, which the adapter now lets a teacher read for a
 * student in their class. Scores are backend values only: a null score renders
 * as "not scored yet" with no bar, never as 0%.
 *
 * Deliberately absent (Part 2 brief): the previous-notes panel and the
 * follow-up message box. `messages.sendMessage` only reaches the assistant and
 * parent threads, so a note to a student has no destination; the control is
 * omitted rather than faked.
 */
export function StudentDrawer({
  studentId,
  studentName,
  classroomName,
  masteryPercent,
  lastScorePercent,
  lastActiveAt,
  onClose,
}: {
  studentId: UserId
  studentName: string
  classroomName: string
  masteryPercent: number
  lastScorePercent: number | null
  lastActiveAt: string | null
  onClose: () => void
}) {
  const strings = useStrings()
  const copy = strings.students.drawer
  const lang = useLang()
  const attemptsQuery = useQuery(studentAttemptsQueryOptions(studentId))

  const recent = (attemptsQuery.data ?? [])
    .filter((attempt) => attempt.status === 'submitted')
    .sort((left, right) =>
      (right.submittedAt ?? right.startedAt).localeCompare(
        left.submittedAt ?? left.startedAt,
      ),
    )
    .slice(0, 3)
    .reverse()

  return (
    <Drawer
      title={studentName}
      subtitle={`${classroomName} · ${strings.students.lastActive}: ${formatDate(
        lastActiveAt,
        strings.students.noActivity,
        lang,
      )}`}
      closeLabel={copy.close}
      onClose={onClose}
      footer={
        <button
          type="button"
          className="tv-btn tv-btn-secondary tv-btn-sm"
          onClick={onClose}
        >
          {copy.close}
        </button>
      }
    >
      <div className="tv-grid-equal">
        <Kpi
          label={copy.average}
          value={formatPercent(masteryPercent, lang)}
        />
        <Kpi
          label={copy.lastScore}
          value={scoreText(lastScorePercent, lang, copy.unavailable)}
        />
      </div>

      <div className="tv-panel">
        <div className="tv-panel-head">
          <span className="tv-panel-title">{copy.trendHeading}</span>
        </div>
        <div className="tv-panel-body">
          {attemptsQuery.isPending ? (
            <LoadingNote>{copy.loading}</LoadingNote>
          ) : attemptsQuery.isError ? (
            <EmptyBox tone="error" title={copy.loadError} />
          ) : recent.length === 0 ? (
            <EmptyBox title={copy.trendEmpty} />
          ) : (
            <ul className="tv-bars" aria-label={copy.trendHeading}>
              {recent.map((attempt, index) => (
                <TrendBar
                  key={attempt.id}
                  attempt={attempt}
                  index={index}
                  label={copy.trendBarLabel(
                    String(index + 1),
                    scoreText(attempt.scorePercent, lang, copy.unavailable),
                  )}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </Drawer>
  )
}

function TrendBar({
  attempt,
  index,
  label,
}: {
  attempt: AttemptSummary
  index: number
  label: string
}) {
  const lang = useLang()
  const copy = useStrings().students.drawer
  const height =
    attempt.scorePercent === null ? 0 : scoreBarHeight(attempt.scorePercent)
  return (
    <li className="tv-bar-col" aria-label={label}>
      <span className="tv-num tv-cell-sub">
        {scoreText(attempt.scorePercent, lang, copy.unavailable)}
      </span>
      {height > 0 ? (
        <div
          className="tv-bar-col__fill"
          style={{ height: `${height}px` }}
          aria-hidden="true"
        />
      ) : null}
      <span className="tv-cell-sub">{copy.trendTestLabel(String(index + 1))}</span>
    </li>
  )
}