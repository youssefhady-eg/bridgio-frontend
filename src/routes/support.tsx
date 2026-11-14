import { createFileRoute } from '@tanstack/react-router'
import { SupportView } from '~/components/shared/SupportView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Support request — interface only. The PROPOSED `support.submitRequest`
 * method is not connected in this build, so the screen collects a request and
 * states that replies arrive with the real backend. No contact detail is
 * invented and no fake success is shown.
 */
export const Route = createFileRoute('/support')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).support.headTitle }],
  }),
  component: SupportView,
})