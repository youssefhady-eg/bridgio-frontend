import { createFileRoute } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  testQuestionsQueryOptions,
  testQueryOptions,
} from '~/api/queries'
import { TestDetail } from '~/components/teacher/TestDetail'
import { stringsFor } from '~/shell/useStrings'

/**
 * Teacher test detail — metadata, questions and publishing state.
 *
 * The loader prefetches the test and its full questions (teacher-only). A
 * failure is swallowed so the screen renders its own not-found/error notes.
 */
export const Route = createFileRoute('/teacher/tests/$testId')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).testDetail.headTitle }],
  }),
  loader: async ({ context, params }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      await context.queryClient.ensureQueryData(
        testQueryOptions(params.testId),
      )
      if (session?.user.role === 'teacher') {
        await context.queryClient.ensureQueryData(
          testQuestionsQueryOptions(params.testId),
        )
      }
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: TestDetailRoute,
})

function TestDetailRoute() {
  const { testId } = Route.useParams()
  return <TestDetail testId={testId} />
}