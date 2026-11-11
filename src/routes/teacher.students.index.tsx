import { createFileRoute } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  teacherDashboardQueryOptions,
} from '~/api/queries'
import { StudentList } from '~/components/teacher/StudentList'
import { stringsFor } from '~/shell/useStrings'

/**
 * Teacher "Students" — every student of the teacher's classes.
 *
 * The dashboard aggregate already carries the per-student progress rows, so the
 * loader prefetches that one call (PROPOSED `teachers.getDashboard`). Failures
 * are swallowed so the screen renders its own error note.
 */
export const Route = createFileRoute('/teacher/students/')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).students.headTitle }],
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
  component: StudentList,
})