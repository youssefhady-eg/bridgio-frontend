import { createFileRoute } from '@tanstack/react-router'
import { ParentView } from '~/components/parent/ParentView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Parents → Progress (display only). Read-only projection of the child's
 * progress, supplied by the backend. No score is computed in the frontend.
 */
export const Route = createFileRoute('/parent/progress')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).parent.headTitle }],
  }),
  component: () => <ParentView section="progress" />,
})
