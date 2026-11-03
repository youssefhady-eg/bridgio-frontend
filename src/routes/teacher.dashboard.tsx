import { createFileRoute } from '@tanstack/react-router'
import { sessionQueryOptions, teacherDashboardQueryOptions } from '~/api/queries'
import { TeacherDashboard } from '~/components/dashboard/TeacherDashboard'
import { stringsFor } from '~/shell/useStrings'

/**
 * Stage 2 — teacher dashboard.
 *
 * The loader prefetches the session and then the dashboard aggregate into the
 * shared Query cache, so the SSR render already contains the classes, recent
 * tests and progress. Both queries still live in `src/api/`; the component
 * never calls `fetch` or reads demo data directly.
 *
 * A failed prefetch is swallowed on purpose: the dashboard renders its own
 * Arabic empty/error/success notes from the query status (token sheet §5), so an
 * unreachable API shows that error note instead of rejecting the route and
 * swapping in the framework's default English error screen.
 */
export const Route = createFileRoute('/teacher/dashboard')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).dashboard.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role === 'teacher') {
        await context.queryClient.ensureQueryData(
          teacherDashboardQueryOptions(session.user.id),
        )
      }
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: TeacherDashboard,
})
