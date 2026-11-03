import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { api } from '~/api'
import { queryKeys } from '~/api/query-keys'
import {
  classTestsQueryOptions,
  sessionQueryOptions,
  studentAttemptsQueryOptions,
  studentProfileQueryOptions,
} from '~/api/queries'
import type { UserId } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { ar } from '~/content/strings'
import { MohsenPanel } from './MohsenPanel'
import { TestList } from './TestList'
import { TestRunner } from './TestRunner'
import {
  attemptForTest,
  dedupeTests,
  groundingScopeForTest,
} from './player'

const strings = ar.player

/**
 * Stage 4 — student test player.
 *
 * The student's classes come from `students.getProfile`, their published tests
 * from `tests.listForClass` per class and their own attempts from
 * `attempts.listForStudent`. Starting/answering/submitting all go through the
 * adapter. The Mohsen Q&A panel shares the screen and is grounded to the open
 * test's source only.
 */
export function StudentTestPlayer() {
  const sessionQuery = useQuery(sessionQueryOptions())

  if (sessionQuery.isPending) {
    return (
      <PlayerFrame>
        <p className="player__loading" role="status">
          {strings.loading}
        </p>
      </PlayerFrame>
    )
  }

  if (sessionQuery.isError) {
    return (
      <PlayerFrame>
        <EmptyNote
          tone="error"
          title={strings.loadErrorTitle}
          body={strings.loadErrorBody}
        />
      </PlayerFrame>
    )
  }

  const studentId =
    sessionQuery.data?.user.role === 'student'
      ? sessionQuery.data.user.id
      : null

  if (studentId === null) {
    return (
      <PlayerFrame>
        <EmptyNote
          icon="alert"
          title={strings.noSessionTitle}
          body={strings.noSessionBody}
        />
      </PlayerFrame>
    )
  }

  return (
    <PlayerFrame>
      <PlayerFlow studentId={studentId} />
    </PlayerFrame>
  )
}

function PlayerFlow({ studentId }: { studentId: UserId }) {
  const queryClient = useQueryClient()
  const [activeTestId, setActiveTestId] = useState<string | null>(null)
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null)

  const profileQuery = useQuery(studentProfileQueryOptions(studentId))
  const attemptsQuery = useQuery(studentAttemptsQueryOptions(studentId))
  const classIds = profileQuery.data?.classroomIds ?? []

  const testQueries = useQueries({
    queries: classIds.map((classroomId) => classTestsQueryOptions(classroomId)),
  })

  const startMutation = useMutation({
    mutationFn: (testId: string) =>
      api.attempts.start({ studentId, testId }),
    onSuccess: (attempt) => {
      setActiveTestId(attempt.testId)
      setActiveAttemptId(attempt.id)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.attempts.forStudent(studentId),
      })
    },
  })

  if (profileQuery.isPending || attemptsQuery.isPending) {
    return (
      <p className="player__loading" role="status">
        {strings.loading}
      </p>
    )
  }

  const testsError =
    profileQuery.isError ||
    attemptsQuery.isError ||
    testQueries.some((query) => query.isError)

  if (testsError) {
    return (
      <EmptyNote
        tone="error"
        title={strings.loadErrorTitle}
        body={strings.loadErrorBody}
      />
    )
  }

  const tests = dedupeTests(testQueries.flatMap((query) => query.data ?? []))
  const attempts = attemptsQuery.data ?? []
  const testsLoading = testQueries.some((query) => query.isPending)

  function openTest(testId: string) {
    const existing = attemptForTest(attempts, testId)
    if (existing?.status === 'submitted') return
    startMutation.reset()
    if (existing) {
      setActiveTestId(testId)
      setActiveAttemptId(existing.id)
    } else {
      startMutation.mutate(testId)
    }
  }

  function closeTest() {
    setActiveAttemptId(null)
    setActiveTestId(null)
    startMutation.reset()
    void queryClient.invalidateQueries({
      queryKey: queryKeys.attempts.forStudent(studentId),
    })
  }

  if (activeAttemptId !== null && activeTestId !== null) {
    return (
      <div className="player__layout">
        <div className="player__main">
          <TestRunner
            attemptId={activeAttemptId}
            studentId={studentId}
            onExit={closeTest}
          />
        </div>
        <MohsenPanel
          studentId={studentId}
          scope={groundingScopeForTest(activeTestId)}
        />
      </div>
    )
  }

  return (
    <section aria-labelledby="player-tests-heading">
      <div className="dashboard__section-head">
        <h2 id="player-tests-heading">{strings.list.heading}</h2>
        <span className="dashboard__count">{tests.length}</span>
      </div>
      <p className="dashboard__section-lead">{strings.list.lead}</p>

      {testsLoading && tests.length === 0 ? (
        <p className="player__loading" role="status">
          {strings.loading}
        </p>
      ) : (
        <TestList
          tests={tests}
          attempts={attempts}
          starting={startMutation.isPending}
          startError={startMutation.isError}
          onOpen={openTest}
        />
      )}
    </section>
  )
}

function PlayerFrame({ children }: { children: ReactNode }) {
  return (
    <div className="player">
      <header className="player__hero">
        <p className="app-shell__badge">{strings.badge}</p>
        <h1>{strings.title}</h1>
        <p className="player__lead">{strings.lead}</p>
      </header>
      {children}
    </div>
  )
}
