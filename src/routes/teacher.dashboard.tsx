import { createFileRoute } from '@tanstack/react-router'
import { sessionQueryOptions, teacherDashboardQueryOptions } from '~/api/queries'
import { TeacherDashboard } from '~/components/dashboard/TeacherDashboard'
import { ar } from '~/content/strings'

/**
 * Stage 2 — teacher dashboard.
 *
 * The loader prefetches the session and then the dashboard aggregate into the
 * shared Query cache, so the SSR render already contains the classes, recent
 * tests and progress. Both queries still live in `src/api/`; the component
 * never calls `fetch` or reads demo data directly.
 */
export const Route = createFileRoute('/teacher/dashboard')({
  head: () => ({
    meta: [{ title: ar.dashboard.headTitle }],
  }),
  loader: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      sessionQueryOptions(),
    )
    if (session?.user.role === 'teacher') {
      await context.queryClient.ensureQueryData(
        teacherDashboardQueryOptions(session.user.id),
      )
    }
  },
  component: TeacherDashboard,
})
