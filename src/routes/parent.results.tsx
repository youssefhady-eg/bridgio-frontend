import { createFileRoute } from '@tanstack/react-router'
import { ParentView } from '~/components/parent/ParentView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Parents → Results (display only). `scorePercent` is backend-supplied; the
 * frontend never computes, guesses or invents a score.
 */
export const Route = createFileRoute('/parent/results')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).parent.headTitle }],
  }),
  component: () => <ParentView section="results" />,
})
