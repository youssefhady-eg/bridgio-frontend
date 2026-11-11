import { createFileRoute } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  studentProgressQueryOptions,
} from '~/api/queries'
import { ProgressView } from '~/components/student/ProgressView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Student "My Progress" — the student's own progress across their units.
 *
 * The loader prefetches the session and the student's own progress
 * (`students.getProgress`, PROPOSED). Failures are swallowed so the screen
 * renders its own no-session/error notes.
 */
export const Route = createFileRoute('/student/progress')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).progress.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role === 'student') {
        await context.queryClient.ensureQueryData(
          studentProgressQueryOptions(session.user.id),
        )
      }
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: ProgressView,
})