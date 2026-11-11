import type { AttemptSummary, TestSummary } from '~/api/types'
import { Link } from '@tanstack/react-router'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip } from '~/components/dashboard/StatusChip'
import { formatCount } from '~/components/dashboard/format'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'
import { attemptForTest, attemptStateFor } from './player'

/**
 * Stage 4 — published tests for the student's classes.
 *
 * Status per row comes from the student's own attempts (adapter data): new,
 * in progress or already submitted. A submitted test offers the review screen;
 * the stage records attempts only and has no marking screen, so the review
 * shows the student's own choices without saying right or wrong.
 */
export function TestList({
  tests,
  attempts,
  starting,
  startError,
  onOpen,
}: {
  tests: readonly TestSummary[]
  attempts: readonly AttemptSummary[]
  starting: boolean
  startError: boolean
  onOpen: (testId: string) => void
}) {
  const strings = useStrings().player.list
  const resultsLabel = useStrings().results.badge
  const lang = useLang()
  const role = usePreviewRole()
  if (tests.length === 0) {
    return (
      <EmptyNote
        icon="tests"
        title={strings.emptyTitle}
        body={strings.emptyBody}
      />
    )
  }

  return (
    <>
      {startError ? (
        <EmptyNote
          tone="error"
          title={strings.startErrorTitle}
          body={strings.startErrorBody}
        />
      ) : null}

      <ul className="player-tests">
        {tests.map((test) => {
          const state = attemptStateFor(attemptForTest(attempts, test.id))
          return (
            <li className="player-test" key={test.id}>
              <div className="player-test__head">
                <h3>{test.title}</h3>
                <StatusChip
                  tone={
                    state === 'submitted'
                      ? 'success'
                      : state === 'in_progress'
                        ? 'warning'
                        : 'neutral'
                  }
                  icon={state === 'submitted' ? 'check' : 'tests'}
                  label={
                    state === 'submitted'
                      ? strings.statusSubmitted
                      : state === 'in_progress'
                        ? strings.statusInProgress
                        : strings.statusNew
                  }
                />
              </div>

              <p className="row-meta">{test.classroomName}</p>
              <p className="row-meta">
                {strings.questions(test.questionCount)}
              </p>

              <div className="player-test__actions">
                {state === 'submitted' ? (
                  <>
                    <p className="screen-meta">{strings.submittedNote}</p>
                    <Link
                      to="/student/tests/$testId/results"
                      params={{ testId: test.id }}
                      search={{ as: role, lang }}
                      className="button button--secondary button--small"
                      preload={false}
                    >
                      {resultsLabel}
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    className="button button--primary"
                    disabled={starting}
                    onClick={() => onOpen(test.id)}
                  >
                    {starting
                      ? strings.starting
                      : state === 'in_progress'
                        ? strings.resume
                        : strings.start}
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
