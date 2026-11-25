import { useQuery } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { api } from '~/api'
import {
  guestPreviewAvailable,
  guestPreviewUser,
} from '~/api/guest-preview'
import { sessionQueryOptions } from '~/api/queries'
import type { User } from '~/api/types'
import { parseAppRole, type AppRole } from './nav'

/**
 * Guest preview state: no session + an explicit `?as=` role, mock adapter only.
 *
 * The adapter deliberately keeps `auth.getSession()` null for a guest, so this
 * hook is the single place the UI borrows the matching demo identity. It is
 * never a session and never grants a write: the adapter's read fallback is
 * keyed to the same URL parameter, while every write still requires a real
 * session.
 */
export interface GuestPreviewState {
  active: boolean
  role: AppRole | null
  user: User | null
}

export function useGuestPreview(): GuestPreviewState {
  const { pathname, href } = useRouterState({
    select: (state) => state.location,
  })
  const explicitRole = parseAppRole(
    new URLSearchParams(href.slice(pathname.length).split('#')[0] ?? '').get(
      'as',
    ),
  )
  const sessionQuery = useQuery(sessionQueryOptions())

  const active =
    guestPreviewAvailable(api.mode) &&
    sessionQuery.isSuccess &&
    sessionQuery.data === null &&
    explicitRole !== undefined
  const role = active ? explicitRole : null

  return {
    active,
    role,
    user: role ? guestPreviewUser(role, api.mode) : null,
  }
}
