import { createFileRoute } from '@tanstack/react-router'
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
  loader: async ({ context }) => {
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