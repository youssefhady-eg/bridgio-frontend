import type { AppRole } from '~/shell/nav'
import { demoUserForRole } from './mock/seed'
import type { User } from './types'

/**
 * UI seam for the read-only guest preview.
 *
 * The preview is demo data, not authentication. The router decides that a
 * visitor is a guest (no session + an explicit `?as=` role); this module maps
 * that role to the seeded demo identity the screens and sidebar display. The
 * mock adapter has its own read-only fallback keyed to the same role, so the
 * screens can query normally without a session ever being created.
 *
 * HTTP mode has no demo identities: every exported helper returns null/false
 * there, and the screens keep their honest signed-out states.
 */
export function guestPreviewAvailable(mode: 'mock' | 'http'): boolean {
  return mode === 'mock'
}

export function guestPreviewUser(
  role: AppRole,
  mode: 'mock' | 'http' = 'mock',
): User | null {
  if (!guestPreviewAvailable(mode)) return null
  return demoUserForRole(role)
}
