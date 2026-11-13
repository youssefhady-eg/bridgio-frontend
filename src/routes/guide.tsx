import { createFileRoute } from '@tanstack/react-router'
import { GuideView } from '~/components/shared/GuideView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Guide — a numbered walkthrough for the current role only. No data is fetched.
 */
export const Route = createFileRoute('/guide')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).guide.headTitle }],
  }),
  component: GuideView,
})