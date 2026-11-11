import { createFileRoute } from '@tanstack/react-router'
import { sessionQueryOptions } from '~/api/queries'
import { ProfileView } from '~/components/shared/ProfileView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Profile and settings — session display plus language and theme controls.
 *
 * The loader prefetches the Mentingo-owned session so the account block renders
 * on SSR. No account edit is offered: users and roles are Mentingo-owned.
 */
export const Route = createFileRoute('/profile')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).profile.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(sessionQueryOptions())
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: ProfileView,
})