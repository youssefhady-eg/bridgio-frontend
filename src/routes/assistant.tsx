import { createFileRoute } from '@tanstack/react-router'
import { api } from '~/api'
import {
  capabilitiesQueryOptions,
  sessionQueryOptions,
} from '~/api/queries'
import { AssistantView } from '~/components/shared/AssistantView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Teacher Assistant — the single screen that lists the granted sections.
 *
 * The loader prefetches the session and that user's capabilities (RBAC-owned,
 * PROPOSED). The frontend never decides grants and has no granting UI.
 */
export const Route = createFileRoute('/assistant')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).assistant.headTitle }],
  }),
  loader: async ({ context, location }) => {
    /*
     * `?as=` on the mock is a read-only preview role, not a session. The
     * adapter resolves it on the client, where `window.location` exists; SSR
     * cannot see it. Prefetching `auth.getSession` here would dehydrate the
     * deployment's seeded account (teacher) into the cache, and the 30 s
     * `staleTime` would then keep that wrong identity on screen after the
     * client adapter had already resolved the preview. Skip the prefetch for a
     * mock preview and let the client answer it; the screen shows its loading
     * state for that one tick instead of the wrong role's content.
     */
    const previewRole = (location.search as { as?: unknown }).as
    if (api.mode === 'mock' && typeof previewRole === 'string') return

    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session) {
        await context.queryClient.ensureQueryData(
          capabilitiesQueryOptions(session.user.id),
        )
      }
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: AssistantView,
})