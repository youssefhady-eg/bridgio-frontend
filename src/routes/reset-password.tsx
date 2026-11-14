import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordView } from '~/components/auth/AccountViews'
import { stringsFor } from '~/shell/useStrings'

/**
 * Password-reset completion — PROPOSED and NOT connected. The token comes from
 * the reset link and is passed through untouched; a missing token is an honest
 * invalid-link state, not a reset form.
 */
export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>): { token: string } => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).auth.reset.headTitle }],
  }),
  component: ResetPasswordScreen,
})

function ResetPasswordScreen() {
  const { token } = Route.useSearch()
  return <ResetPasswordView token={token} />
}
