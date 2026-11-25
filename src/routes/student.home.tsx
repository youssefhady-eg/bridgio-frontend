import { createFileRoute } from '@tanstack/react-router'
import { api } from '~/api'
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
  loader: async ({ context, location }) => {
    /*
     * `?as=` on the mock is a read-only preview role, not a session. The
     * adapter resolves it on the client, where `window.location` exists; SSR
     * cannot see it. Prefetching `auth.getSession` here would dehydrate the
     * deployment's seeded account (teacher) into the cache, and the 30 s
     * `staleTime` would then keep that wrong identity on screen even after the
     * client adapter had resolved the preview. That is what made the guest
     * preview vanish on the language switch: the switch is a full navigation,
     * so the fresh server render baked the seeded teacher back in and the
     * screen said "No student session". Skip the prefetch for a mock preview
     * and let the client answer it; the screen shows its loading state for
     * that one tick instead of the wrong role's content.
     */
    const previewRole = (location.search as { as?: unknown }).as
    if (api.mode === 'mock' && typeof previewRole === 'string') return

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
