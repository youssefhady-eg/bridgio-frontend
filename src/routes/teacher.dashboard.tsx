import { createFileRoute } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  teacherDashboardQueryOptions,
  teacherTestsQueryOptions,
} from '~/api/queries'
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
  head: ({ match }) => {
    const copy = stringsFor(match.search.lang).dashboard
    // The loader returns the session gender so the document title follows the
    // same rule as the heading. The head context types the loader data loosely,
    // so it is narrowed here.
    const loaderData = match.loaderData as
      | { gender?: 'male' | 'female' | null }
      | undefined
    return {
      meta: [
        {
          title:
            loaderData?.gender === 'female'
              ? copy.headTitleFemale
              : copy.headTitle,
        },
      ],
    }
  },
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role === 'teacher') {
        await Promise.all([
          context.queryClient.ensureQueryData(
            teacherDashboardQueryOptions(session.user.id),
          ),
          // The dashboard lists every draft, and the aggregate only carries the
          // five most recent tests, so the full teacher test list is prefetched
          // alongside it.
          context.queryClient.ensureQueryData(
            teacherTestsQueryOptions(session.user.id),
          ),
        ])
      }
      return { gender: session?.user.gender ?? null }
    } catch {
      // Query status carries the failure to the screen's error state.
      return { gender: null }
    }
  },
  component: TeacherDashboard,
})
