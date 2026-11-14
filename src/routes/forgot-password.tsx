import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordView } from '~/components/auth/AccountViews'
import { stringsFor } from '~/shell/useStrings'

/** Password-reset request — PROPOSED and NOT connected. */
export const Route = createFileRoute('/forgot-password')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).auth.forgot.headTitle }],
  }),
  component: ForgotPasswordView,
})
