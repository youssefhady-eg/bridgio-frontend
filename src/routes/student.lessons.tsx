import { createFileRoute } from '@tanstack/react-router'
import {
  classroomDetailQueryOptions,
  sessionQueryOptions,
  studentProfileQueryOptions,
  studentProgressQueryOptions,
} from '~/api/queries'
import { Lessons } from '~/components/student/Lessons'
import { stringsFor } from '~/shell/useStrings'

/**
 * Student "Lessons" — the units of each enrolled class with their progress.
 *
 * The loader prefetches the session and the student's profile, then the class
 * details and per-class progress. Failures are swallowed so the screen renders
 * its own no-session/error/empty notes.
 */
export const Route = createFileRoute('/student/lessons')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).lessons.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role !== 'student') return
      const profile = await context.queryClient.ensureQueryData(
        studentProfileQueryOptions(session.user.id),
      )
      await Promise.all(
        profile.classroomIds.flatMap((classroomId) => [
          context.queryClient.ensureQueryData(
            classroomDetailQueryOptions(classroomId),
          ),
          context.queryClient.ensureQueryData(
            studentProgressQueryOptions(session.user.id, classroomId),
          ),
        ]),
      )
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: Lessons,
})