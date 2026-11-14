import { createFileRoute } from '@tanstack/react-router'
import { SearchView } from '~/components/search/SearchView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Global search — the query is a URL param (`/search?q=`), so a result page is
 * shareable and the back button restores the previous search.
 */
export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): { q: string } => ({
    q: typeof search.q === 'string' ? search.q : '',
  }),
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).search.headTitle }],
  }),
  component: SearchScreen,
})

function SearchScreen() {
  const { q } = Route.useSearch()
  return <SearchView query={q} />
}
