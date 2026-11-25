import { createFileRoute } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  teacherClassroomsQueryOptions,
  teacherTestsQueryOptions,
} from '~/api/queries'
import { ClassList } from '~/components/teacher/ClassList'
import { stringsFor } from '~/shell/useStrings'

/**
 * Teacher "My Classes" — the full class list at `/teacher/classes`.
 *
 * The loader prefetches the Mentingo-owned session and the teacher's classes
 * through the adapter/query layer so the list renders from cache on SSR. A
 * failed prefetch is swallowed on purpose: the screen draws its own
 * error/empty notes from the query status instead of the framework's default
 * English error screen.
 */
export const Route = createFileRoute('/teacher/classes/')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).classes.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role === 'teacher') {
        await Promise.all([
          context.queryClient.ensureQueryData(
            teacherClassroomsQueryOptions(session.user.id),
          ),
          context.queryClient.ensureQueryData(
            teacherTestsQueryOptions(session.user.id),
          ),
        ])
      }
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: ClassList,
})