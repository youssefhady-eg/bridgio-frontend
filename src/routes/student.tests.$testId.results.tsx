import { createFileRoute } from '@tanstack/react-router'
import {
  attemptQueryOptions,
  sessionQueryOptions,
  studentAttemptsQueryOptions,
  studentTestQuestionsQueryOptions,
} from '~/api/queries'
import { TestResults } from '~/components/student/TestResults'
import { stringsFor } from '~/shell/useStrings'

/**
 * Student test review — the student's own submitted attempt.
 *
 * The loader prefetches the student's attempts, then (when an attempt exists for
 * this test) the attempt detail and the student-safe questions. The answer key
 * is never requested: `listForStudentTest` is used, never `listForTest`.
 */
export const Route = createFileRoute('/student/tests/$testId/results')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).results.headTitle }],
  }),
  loader: async ({ context, params }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role !== 'student') return
      const attempts = await context.queryClient.ensureQueryData(
        studentAttemptsQueryOptions(session.user.id),
      )
      const attempt = attempts.find((item) => item.testId === params.testId)
      if (!attempt) return
      await Promise.all([
        context.queryClient.ensureQueryData(attemptQueryOptions(attempt.id)),
        context.queryClient.ensureQueryData(
          studentTestQuestionsQueryOptions(params.testId),
        ),
      ])
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: TestResultsRoute,
})

function TestResultsRoute() {
  const { testId } = Route.useParams()
  return <TestResults testId={testId} />
}