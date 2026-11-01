import type {
  AttemptId,
  ClassroomId,
  IsoDateTime,
  OptionId,
  QuestionId,
  TestId,
  UserId,
} from './common'

/**
 * Student test attempts.
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 *
 * Deliberately has NO score, grade or correct/incorrect fields: intelligent
 * marking is deferred by the owner (2026-10-28) and must not be promised in UI.
 * `submit` records the attempt; it does not mark it.
 */

export type AttemptStatus = 'in_progress' | 'submitted'

export interface AttemptAnswer {
  questionId: QuestionId
  optionId: OptionId | null
  answeredAt: IsoDateTime | null
}

export interface AttemptSummary {
  id: AttemptId
  testId: TestId
  testTitle: string
  classroomId: ClassroomId
  classroomName: string
  status: AttemptStatus
  answeredCount: number
  questionCount: number
  startedAt: IsoDateTime
  submittedAt: IsoDateTime | null
}

export interface Attempt extends AttemptSummary {
  studentId: UserId
  answers: AttemptAnswer[]
}

export interface StartAttemptInput {
  studentId: UserId
  testId: TestId
}

export interface SaveAnswerInput {
  attemptId: AttemptId
  questionId: QuestionId
  optionId: OptionId
}

export interface SubmitAttemptInput {
  attemptId: AttemptId
}
