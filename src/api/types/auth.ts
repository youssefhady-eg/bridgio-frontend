import type { IsoDateTime, UserId, UserRole } from './common'

/**
 * A Mentingo user. BRIDGIO does not own a user model, auth system or role system.
 * Teacher and student are Mentingo roles reached through Mentingo auth.
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 */
export interface User {
  id: UserId
  role: UserRole
  displayName: string
  email: string
  avatarUrl: string | null
}

/**
 * The authenticated session, as projected to the UI.
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 * The auth transport (cookie vs bearer token) is UNCONFIRMED and is an integration
 * gap. No token is exposed here, stored in the frontend, or baked into UI state.
 */
export interface Session {
  user: User
  expiresAt: IsoDateTime | null
}

/**
 * PROPOSED — Mentingo to implement on restore/rebuild.
 * The exact credential shape is UNCONFIRMED. This is a contract placeholder so the
 * mock can exercise role switching; it is NOT an instruction to build a BRIDGIO
 * sign-in screen. When Mentingo auth is available, this method delegates to it.
 */
export interface SignInInput {
  email: string
  password: string
}
