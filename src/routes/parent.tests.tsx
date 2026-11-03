import { createFileRoute } from '@tanstack/react-router'
import { ParentView } from '~/components/parent/ParentView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Parents → Tests (display only). Shows each published test's state and how
 * many questions were answered; it never marks an answer.
 */
export const Route = createFileRoute('/parent/tests')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).parent.headTitle }],
  }),
  component: () => <ParentView section="tests" />,
})
