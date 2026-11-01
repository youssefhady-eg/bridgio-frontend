import type {
  ClassroomId,
  IsoDateTime,
  MaterialId,
  OptionId,
  QuestionId,
  TestId,
  UnitId,
  UserId,
} from './common'
import type { GroundingRef } from './grounding'

/**
 * Tests, questions and the teacher-authored test source.
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 * Maps to a proposed Mentingo "test" entity with questions. No intelligent
 * marking / auto-grading is part of this contract; attempts are collected only.
 */

export type TestStatus = 'draft' | 'published'

/** A test is grounded in either one material or one fixed-curriculum unit. */
export type TestSourceInput =
  | { kind: 'material'; materialId: MaterialId }
  | { kind: 'curriculum_unit'; unitId: UnitId }

export type TestSource =
  | {
      kind: 'material'
      materialId: MaterialId
      unitId: UnitId | null
      label: string
    }
  | {
      kind: 'curriculum_unit'
      materialId: null
      unitId: UnitId
      label: string
    }

export interface TestSummary {
  id: TestId
  title: string
  classroomId: ClassroomId
  classroomName: string
  status: TestStatus
  questionCount: number
  updatedAt: IsoDateTime
  publishedAt: IsoDateTime | null
}

export interface Test extends TestSummary {
  teacherId: UserId
  description: string | null
  source: TestSource
  createdAt: IsoDateTime
}

export interface CreateTestDraftInput {
  teacherId: UserId
  classroomId: ClassroomId
  title: string
  description: string | null
  source: TestSourceInput
}

export interface UpdateTestInput {
  title?: string
  description?: string | null
}

export interface QuestionOption {
  id: OptionId
  text: string
}

export type QuestionOrigin = 'teacher' | 'mohsen'

export interface Question {
  id: QuestionId
  testId: TestId
  order: number
  prompt: string
  options: QuestionOption[]
  /**
   * Authoring metadata only. The MVP does NOT auto-mark or score attempts and no
   * UI may promise marking. Kept so a teacher can record the intended answer.
   */
  correctOptionId: OptionId | null
  /**
   * Invariant: questions drafted by Mohsen always carry at least one grounding
   * reference. Teacher-authored questions may carry the test source grounding or
   * be empty when the teacher wrote them from scratch.
   */
  grounding: GroundingRef[]
  origin: QuestionOrigin
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

export interface CreateQuestionInput {
  prompt: string
  /** Two to six options, in display order. */
  options: string[]
  /** Index into `options`, or null when the teacher leaves it unset. */
  correctOptionIndex: number | null
}

export interface UpdateQuestionInput {
  prompt?: string
  options?: string[]
  correctOptionIndex?: number | null
}

export interface ReorderQuestionsInput {
  /** Every question of the test, once, in the new order. */
  questionIds: QuestionId[]
}
