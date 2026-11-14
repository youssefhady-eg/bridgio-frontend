import { createFileRoute } from '@tanstack/react-router'
import {
  notificationsQueryOptions,
  sessionQueryOptions,
} from '~/api/queries'
import { NotificationsView } from '~/components/notifications/NotificationsView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Notifications — teacher-only in Batch 5.
 *
 * The loader prefetches the session and, for a teacher, the derived
 * notification list (`notifications.listForUser`, PROPOSED). A failed prefetch
 * is swallowed so the screen renders its own loading/error/role state.
 */
export const Route = createFileRoute('/notifications')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).notifications.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role === 'teacher') {
        await context.queryClient.ensureQueryData(
          notificationsQueryOptions(session.user.id),
        )
      }
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: NotificationsView,
})
