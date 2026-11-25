/**
 * Support request — PROPOSED, NOT connected.
 *
 * The support channel is owned by a backend that does not exist in this build.
 * The frontend may collect a request, but it must NOT claim it was delivered,
 * must NOT show an invented contact address, and must NOT fake a reply.
 *
 * The result is a discriminated union so the UI can tell the two outcomes
 * apart at the type level:
 *   - `{ status: 'accepted' }` — the support backend accepted the request.
 *   - `{ status: 'unavailable'; reason: 'support_backend_missing' }` — the
 *     support backend is not connected. The mock ALWAYS returns this.
 *
 * PROPOSED — backend to implement on restore/rebuild.
 */

export type SupportUnavailableReason = 'support_backend_missing'

export type SupportResult =
  | { status: 'accepted' }
  | { status: 'unavailable'; reason: SupportUnavailableReason }

export interface SupportRequestInput {
  name: string
  email: string
  subject: string
  message: string
}