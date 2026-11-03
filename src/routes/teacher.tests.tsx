import { createFileRoute } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  teacherClassroomsQueryOptions,
} from '~/api/queries'
import { TestBuilder } from '~/components/builder/TestBuilder'
import { ar } from '~/content/strings'

/**
 * Stage 3 — teacher test builder. The teacher "Tests" nav destination now
 * opens the real four-step builder; the Stage 2 dashboard recent-test rows stay
 * non-interactive (no test-detail screen is invented here).
 *
 * The loader prefetches the Mentingo-owned session and the teacher's classes
 * through the adapter/query layer so step 1 renders with real class data on
 * SSR. Materials/units are fetched only after a class is chosen.
 */
export const Route = createFileRoute('/teacher/tests')({
  head: () => ({
    meta: [{ title: ar.builder.headTitle }],
  }),
  loader: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      sessionQueryOptions(),
    )
    if (session?.user.role === 'teacher') {
      await context.queryClient.ensureQueryData(
        teacherClassroomsQueryOptions(session.user.id),
      )
    }
  },
  component: TestBuilder,
})
