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
 * There is NO marking in this frontend and none is promised: no score is
 * calculated, no answer is judged right or wrong, and `submit` records the
 * attempt without marking it. A score exists only where the backend supplies
 * one (`scorePercent`), and it is rendered exactly as supplied — a null score
 * reads as "score unavailable", never as a zero.
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
  /**
   * Backend-supplied score for this attempt, or null while the backend has not
   * produced one. The frontend never computes or derives it from `answers`; it
   * is display-only data, in the same spirit as the parent view's
   * `ParentResult.scorePercent`.
   */
  scorePercent: number | null
}

/**
 * One attempt on a test as its owning teacher sees it (`attempts.listForTest`).
 *
 * PROPOSED — NEW in Batch 2. The contract had `attempts.listForStudent` only,
 * so a teacher had no way to read the attempts on one of their own tests. The
 * student's name is part of the payload because the teacher's list has to show
 * who sat the test; `scorePercent` is backend-supplied and never computed here.
 */
export interface TestAttemptSummary {
  id: AttemptId
  testId: TestId
  studentId: UserId
  studentName: string
  status: AttemptStatus
  answeredCount: number
  questionCount: number
  startedAt: IsoDateTime
  submittedAt: IsoDateTime | null
  scorePercent: number | null
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
