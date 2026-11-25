import { createFileRoute } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  teacherClassroomsQueryOptions,
} from '~/api/queries'
import { TestBuilder } from '~/components/builder/TestBuilder'
import { stringsFor } from '~/shell/useStrings'

/**
 * Stage 3 — teacher test builder, now at `/teacher/tests/new` (Part 2 moved it
 * off `/teacher/tests`, which is the test list).
 *
 * The loader prefetches the Mentingo-owned session and the teacher's classes
 * through the adapter/query layer so step 1 renders with real class data on
 * SSR. Materials/units are fetched only after a class is chosen.
 *
 * A failed prefetch is swallowed on purpose so the builder renders its own
 * Arabic empty/error/success notes from the query status (token sheet A5)
 * instead of the framework's default English error screen.
 */
export const Route = createFileRoute('/teacher/tests/new')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).builder.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role === 'teacher') {
        await context.queryClient.ensureQueryData(
          teacherClassroomsQueryOptions(session.user.id),
        )
      }
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: TestBuilder,
})