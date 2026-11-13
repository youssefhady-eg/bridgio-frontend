import { createFileRoute } from '@tanstack/react-router'
import {
  materialLibraryQueryOptions,
  sessionQueryOptions,
} from '~/api/queries'
import { MaterialLibrary } from '~/components/teacher/MaterialLibrary'
import { stringsFor } from '~/shell/useStrings'

/**
 * Teacher material library at `/teacher/materials`.
 *
 * The loader prefetches the session and the composed library (materials +
 * classes + unit names) so the screen renders from cache on SSR. Failures are
 * swallowed so the screen draws its own error/empty notes from the query
 * status. Teacher-only: `materials.listForTeacher` and `materials.create` are
 * scoped to the signed-in teacher in the adapter.
 */
export const Route = createFileRoute('/teacher/materials')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).materialLibrary.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role === 'teacher') {
        await context.queryClient.ensureQueryData(
          materialLibraryQueryOptions(session.user.id),
        )
      }
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: MaterialLibrary,
})
