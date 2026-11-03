import { createFileRoute } from '@tanstack/react-router'
import { ParentView } from '~/components/parent/ParentView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Parents → Messages. In-app chat popup surface (mock only), in the pattern of
 * the planned AI Chat popup: conversations with the Teacher and the Teacher
 * Assistant, an input and deterministic mock replies. No real-time, no
 * notifications, no external channel.
 */
export const Route = createFileRoute('/parent/messages')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).parent.headTitle }],
  }),
  component: () => <ParentView section="messages" />,
})
