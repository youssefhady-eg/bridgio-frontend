import type { User } from './auth'
import type { ClassroomId, IsoDateTime, TestId, UnitId, UserId } from './common'

/**
 * Parent (UI name "Parents" — not "Guardian") projections.
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 *
 * Display only. The parent screens show what the backend returns and never
 * calculate anything: `scorePercent` is supplied by the backend (teacher-entered
 * or backend-marked — that open decision lives in Mentingo, not here). No
 * marking algorithm exists in this frontend, and no marking is added to the
 * student player. Every field below is read-only.
 */

/** A child linked to the signed-in parent. */
export interface ParentChild {
  student: User
  classroomId: ClassroomId | null
  classroomName: string | null
  gradeLevel: string
}

export interface ParentUnitProgress {
  unitId: UnitId
  unitTitle: string
  progressPercent: number
  lessonsCompleted: number
}

export interface ParentProgress {
  childId: UserId
  overallPercent: number
  completedUnits: number
  totalUnits: number
  units: ParentUnitProgress[]
  lastActiveAt: IsoDateTime | null
}

/** The child's attempt state for one published test. */
export type ParentTestStatus = 'not_started' | 'in_progress' | 'submitted'

export interface ParentTest {
  id: TestId
  title: string
  classroomName: string
  status: ParentTestStatus
  questionCount: number
  answeredCount: number
  submittedAt: IsoDateTime | null
}

/** A submitted attempt as a parent result row. `scorePercent` is backend-supplied. */
export interface ParentResult {
  attemptId: string
  testId: TestId
  testTitle: string
  classroomName: string
  submittedAt: IsoDateTime | null
  answeredCount: number
  questionCount: number
  /** Backend-supplied score, or null while the backend has not produced one. */
  scorePercent: number | null
}

/** One child's full parent view, assembled by the adapter (not by the UI). */
export interface ParentOverview {
  child: ParentChild
  progress: ParentProgress
  tests: ParentTest[]
  results: ParentResult[]
}

/** PROPOSED — Mentingo to implement on restore/rebuild. */
export interface ParentProfile {
  user: User
  children: ParentChild[]
}
