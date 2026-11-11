import { createFileRoute } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  studentProfileQueryOptions,
  studentProgressQueryOptions,
  teacherClassroomsQueryOptions,
} from '~/api/queries'
import { StudentDetail } from '~/components/teacher/StudentDetail'
import { stringsFor } from '~/shell/useStrings'

/**
 * Teacher student detail — profile and progress across units.
 *
 * The loader prefetches the student profile and progress, plus the teacher's
 * classes for the class names. Failures are swallowed so the screen renders its
 * own not-found/error notes.
 */
export const Route = createFileRoute('/teacher/students/$studentId')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).students.headTitle }],
  }),
  loader: async ({ context, params }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      await Promise.all([
        context.queryClient.ensureQueryData(
          studentProfileQueryOptions(params.studentId),
        ),
        context.queryClient.ensureQueryData(
          studentProgressQueryOptions(params.studentId),
        ),
        session?.user.role === 'teacher'
          ? context.queryClient.ensureQueryData(
              teacherClassroomsQueryOptions(session.user.id),
            )
          : Promise.resolve(),
      ])
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: StudentDetailRoute,
})

function StudentDetailRoute() {
  const { studentId } = Route.useParams()
  return <StudentDetail studentId={studentId} />
}