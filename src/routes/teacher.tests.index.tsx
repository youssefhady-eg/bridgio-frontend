import { createFileRoute } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  teacherClassroomsQueryOptions,
  teacherTestsQueryOptions,
} from '~/api/queries'
import { TestsList } from '~/components/teacher/TestsList'
import { stringsFor } from '~/shell/useStrings'

/**
 * Part 2 (2026-11-22) — teacher test list at `/teacher/tests`.
 *
 * The loader prefetches the session, the teacher's tests and the teacher's
 * classes (for the class filter) through the adapter/query layer so the table
 * renders from cache on SSR. A failed prefetch is swallowed on purpose so the
 * screen draws its own error/empty notes from the query status.
 */
export const Route = createFileRoute('/teacher/tests/')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).testsList.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role === 'teacher') {
        await Promise.all([
          context.queryClient.ensureQueryData(
            teacherTestsQueryOptions(session.user.id),
          ),
          context.queryClient.ensureQueryData(
            teacherClassroomsQueryOptions(session.user.id),
          ),
        ])
      }
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: TestsList,
})