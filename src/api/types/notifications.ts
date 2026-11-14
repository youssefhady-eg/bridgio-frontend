import type { IsoDateTime, UserId } from './common'

/**
 * In-app notifications — PROPOSED, mock only.
 *
 * There is NO notifications backend today and no push/real-time transport. This
 * shape is a proposal for Mentingo to implement on restore/rebuild; the mock
 * adapter DERIVES every row from existing seed data (submissions, published
 * tests, messages), so nothing here is invented content.
 *
 * Batch 5 scope is teacher-only: the notifications screen and its sidebar entry
 * are shown to the teacher role only, and the mock returns an empty list for any
 * other role rather than inventing rows.
 */
export type NotificationKind = 'submission' | 'published_test' | 'message'

export interface Notification {
  id: string
  kind: NotificationKind
  /** Short event title, supplied by the backend. */
  title: string
  /** One-line detail, supplied by the backend. */
  body: string
  occurredAt: IsoDateTime
  /**
   * In-app route this notification points at, or null when there is nowhere to
   * go. The value is produced by the backend, not assembled in a component.
   */
  link: string | null
}

export interface ListNotificationsInput {
  userId: UserId
}
