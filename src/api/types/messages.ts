import type { IsoDateTime, UserId } from './common'

/**
 * In-app chat — PROPOSED, mock only.
 *
 * This is an in-app conversation surface in the pattern of the planned AI Chat /
 * AI Assistant popup — never WhatsApp and never an external channel. No
 * real-time transport, no notifications, and no confirmed backend endpoint is
 * claimed: the whole surface is mocked in this MVP and every method stays
 * PROPOSED. The parent sees the Teacher and the Teacher Assistant; a message
 * sent from the popup is answered by a deterministic mock reply in the mock
 * adapter.
 */

export type MessageAuthorRole = 'parent' | 'teacher' | 'assistant'

export interface MessageParticipant {
  role: MessageAuthorRole
  name: string
}

export interface MessageThread {
  id: string
  title: string
  participant: MessageParticipant
  lastMessageAt: IsoDateTime
}

export interface Message {
  id: string
  threadId: string
  author: MessageParticipant
  /** True when the signed-in user sent this message. */
  fromMe: boolean
  body: string
  sentAt: IsoDateTime
}

export interface SendMessageInput {
  threadId: string
  body: string
}

export interface SendMessageResult {
  /** The sent message plus the deterministic mock reply, in order. */
  messages: Message[]
  /** Author of the mock reply, so the UI can label who answered. */
  repliedBy: MessageParticipant | null
}
