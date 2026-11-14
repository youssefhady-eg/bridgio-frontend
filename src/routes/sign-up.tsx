import { createFileRoute } from '@tanstack/react-router'
import { SignUpView } from '~/components/auth/AccountViews'
import { stringsFor } from '~/shell/useStrings'

/** Sign-up — PROPOSED and NOT connected; the screen says so honestly. */
export const Route = createFileRoute('/sign-up')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).auth.signUp.headTitle }],
  }),
  component: SignUpView,
})
