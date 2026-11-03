/**
 * BRIDGIO API contract — shared primitives.
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 * Mentingo's local source was deleted by the owner (2026-11-01). Nothing in this
 * file describes a confirmed Mentingo endpoint, table or field. All IDs are
 * opaque strings owned by the backend; the frontend must never parse them.
 */

/** Opaque identifier owned by the backend (Mentingo). Never parse or construct one. */
export type UserId = string
export type ClassroomId = string
export type SubjectId = string
export type UnitId = string
export type MaterialId = string
export type TestId = string
export type QuestionId = string
export type OptionId = string
export type AttemptId = string

/** ISO-8601 timestamp supplied by the backend. */
export type IsoDateTime = string

/**
 * Mentingo roles used by the MVP. There is no separate BRIDGIO user or role
 * system: `assistant` is a Teacher Assistant (a human role, not Mohsen) and
 * `parent` is a student's parent (UI name "Parents", not "Guardian"). Their
 * permissions are backend/RBAC-owned — the frontend only displays what it is
 * granted.
 */
export type UserRole = 'teacher' | 'student' | 'assistant' | 'parent'

/** Which implementation of the single API layer is active. */
export type ApiMode = 'mock' | 'http'

/** Marks every shape in this contract. Do not remove or present it as confirmed. */
export const CONTRACT_STATUS = 'PROPOSED' as const
export type ContractStatus = typeof CONTRACT_STATUS
