import { createFileRoute } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  studentAttemptsQueryOptions,
  studentProfileQueryOptions,
  studentProgressQueryOptions,
} from '~/api/queries'
import { HomeView } from '~/components/student/HomeView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Student home — where `/` lands a student.
 *
 * The loader prefetches the session and the three PROPOSED reads the screen
 * shows: profile, progress and the student's attempts. Failures are swallowed
 * so each section renders its own state.
 */
export const Route = createFileRoute('/student/home')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).studentHome.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role === 'student') {
        await Promise.all([
          context.queryClient.ensureQueryData(
            studentProfileQueryOptions(session.user.id),
          ),
          context.queryClient.ensureQueryData(
            studentProgressQueryOptions(session.user.id),
          ),
          context.queryClient.ensureQueryData(
            studentAttemptsQueryOptions(session.user.id),
          ),
        ])
      }
    } catch {
      // Query status carries the failure to the screen's error states.
    }
  },
  component: HomeView,
})
