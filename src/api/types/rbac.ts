import type { UserId } from './common'

/**
 * Teacher Assistant grants — PROPOSED, backend/RBAC-owned.
 *
 * The frontend does NOT decide what a Teacher Assistant may see. It asks the
 * adapter which nav capabilities the signed-in assistant has been granted and
 * renders only those. There is no granting UI in BRIDGIO and no hardcoded
 * assistant menu: a capability that is not granted is simply not in `items`.
 *
 * `NavCapability` is a stable capability key, deliberately decoupled from any
 * frontend route so the backend never has to know UI paths.
 */
export type NavCapability = 'dashboard' | 'classes' | 'tests' | 'students'

/** PROPOSED — Mentingo to implement on restore/rebuild. */
export interface UserCapabilities {
  userId: UserId
  /** Capabilities the backend has granted this user. Empty means none. */
  items: NavCapability[]
}
