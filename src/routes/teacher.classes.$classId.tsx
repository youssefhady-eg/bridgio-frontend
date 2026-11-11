import { createFileRoute } from '@tanstack/react-router'
import {
  classroomDetailQueryOptions,
  classroomStudentsQueryOptions,
  sessionQueryOptions,
  teacherTestsQueryOptions,
} from '~/api/queries'
import { ClassDetail } from '~/components/teacher/ClassDetail'
import { stringsFor } from '~/shell/useStrings'

/**
 * Teacher class detail — units, roster and the class tests.
 *
 * The loader prefetches the class, its roster and the teacher's tests so the
 * detail renders from cache. Failures are swallowed on purpose so the screen
 * shows its own not-found/error notes.
 */
export const Route = createFileRoute('/teacher/classes/$classId')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).classes.headTitle }],
  }),
  loader: async ({ context, params }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      await Promise.all([
        context.queryClient.ensureQueryData(
          classroomDetailQueryOptions(params.classId),
        ),
        context.queryClient.ensureQueryData(
          classroomStudentsQueryOptions(params.classId),
        ),
        session?.user.role === 'teacher'
          ? context.queryClient.ensureQueryData(
              teacherTestsQueryOptions(session.user.id),
            )
          : Promise.resolve(),
      ])
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: ClassDetailRoute,
})

function ClassDetailRoute() {
  const { classId } = Route.useParams()
  return <ClassDetail classId={classId} />
}