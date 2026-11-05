import { useRouterState } from '@tanstack/react-router'
import { defaultRoleForPath, parseAppRole, type AppRole } from '~/shell/nav'

/**
 * Preview role for the shell (`?as=teacher|student`) — diagnostic UI state
 * only, not auth. Without `?as` the role follows the route area. Read from the router location so it works
 * in every route, including notFound/error states.
 */
export function usePreviewRole(): AppRole {
  const { pathname, href } = useRouterState({
    select: (state) => state.location,
  })
  const searchStr = href.slice(pathname.length).split('#')[0] ?? ''
  return parseAppRole(new URLSearchParams(searchStr).get('as')) ?? defaultRoleForPath(pathname)
}
