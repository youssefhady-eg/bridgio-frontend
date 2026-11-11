import { createFileRoute } from '@tanstack/react-router'
import { HelpView } from '~/components/shared/HelpView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Help and guide — a static map of the built screens and the build's limits.
 * No data is fetched.
 */
export const Route = createFileRoute('/help')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).help.headTitle }],
  }),
  component: HelpView,
})