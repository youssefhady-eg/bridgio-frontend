import { createFileRoute } from '@tanstack/react-router'
import { SignInView } from '~/components/shared/SignInView'
import { stringsFor } from '~/shell/useStrings'

/**
 * Sign in — informational only.
 *
 * There is no BRIDGIO auth and Mentingo auth is not connected, so this screen
 * never calls `auth.signIn`. It states that plainly instead of faking a flow.
 */
export const Route = createFileRoute('/sign-in')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).auth.headTitle }],
  }),
  component: SignInView,
})