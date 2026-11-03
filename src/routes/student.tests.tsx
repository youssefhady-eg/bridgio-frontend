import { createFileRoute } from '@tanstack/react-router'
import {
  classTestsQueryOptions,
  sessionQueryOptions,
  studentAttemptsQueryOptions,
  studentProfileQueryOptions,
} from '~/api/queries'
import { StudentTestPlayer } from '~/components/player/StudentTestPlayer'
import { stringsFor } from '~/shell/useStrings'

/**
 * Stage 4 — student test player. The student "My Tests" nav destination now
 * opens the real player; Lessons and Progress stay explicit placeholders.
 *
 * The loader prefetches the Mentingo-owned session, then (for a student) the
 * profile, the student's attempts and the published tests per enrolled class, all
 * through the adapter/query layer. With the default mock teacher session the
 * player shows an honest "no student session" note — the demo runs with
 * `VITE_MOCK_SESSION=student` (see the Stage 4 delivery note).
 *
 * A failed prefetch is swallowed on purpose so the player renders its own
 * Arabic empty/error/success notes from the query status (token sheet §5)
 * instead of the framework's default English error screen.
 */
export const Route = createFileRoute('/student/tests')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).player.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role === 'student') {
        const studentId = session.user.id
        const profile = await context.queryClient.ensureQueryData(
          studentProfileQueryOptions(studentId),
        )
        await context.queryClient.ensureQueryData(
          studentAttemptsQueryOptions(studentId),
        )
        await Promise.all(
          profile.classroomIds.map((classroomId) =>
            context.queryClient.ensureQueryData(
              classTestsQueryOptions(classroomId),
            ),
          ),
        )
      }
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: StudentTestPlayer,
})
