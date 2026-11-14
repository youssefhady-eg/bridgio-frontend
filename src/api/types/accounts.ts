/**
 * Self-service account flows — PROPOSED, NOT connected.
 *
 * Sign-up, password-reset request and password-reset completion are owned by
 * Mentingo auth, which does not exist in this build. The frontend must NOT fake
 * success, must NOT create a local account, and must NOT pretend a reset email
 * was sent.
 *
 * To make that honest at the type level every method returns a discriminated
 * result instead of a `void`/`Session`:
 *   - `{ status: 'accepted' }` — the backend accepted the request.
 *   - `{ status: 'unavailable'; reason: 'accounts_backend_missing' }` — the
 *     accounts backend is not connected yet. The mock ALWAYS returns this, and
 *     the UI renders one centralised "not available yet" state. No success is
 *     ever shown for this outcome.
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 */

export type AccountsUnavailableReason = 'accounts_backend_missing'

export type AccountsResult =
  | { status: 'accepted' }
  | { status: 'unavailable'; reason: AccountsUnavailableReason }

export interface SignUpInput {
  fullName: string
  email: string
  password: string
}

export interface RequestPasswordResetInput {
  email: string
}

export interface ResetPasswordInput {
  /** Opaque reset token from the reset link. Never parsed by the frontend. */
  token: string
  password: string
}
