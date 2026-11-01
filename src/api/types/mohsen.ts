import type { TestId, UserId } from './common'
import type { GroundingRef, GroundingScope } from './grounding'
import type { Question } from './tests'

/**
 * Mohsen — grounded curriculum assistant (working name).
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 *
 * Rules encoded in the contract:
 * - Answers come only from teacher-uploaded material + the fixed Egyptian curriculum.
 * - No ungrounded chat. When the source material does not contain the answer, the
 *   adapter returns `not_grounded` with a refusal; it never guesses.
 * - Every answered result carries at least one `GroundingRef` for display.
 */

export interface AskMohsenInput {
  question: string
  askedBy: UserId
  /** What the answer may be grounded in. Never omitted. */
  scope: GroundingScope
}

export type MohsenAnswer =
  | {
      status: 'answered'
      answer: string
      /** At least one reference. UI must show it with the answer. */
      grounding: GroundingRef[]
    }
  | {
      status: 'not_grounded'
      /** Fixed refusal copy supplied by the backend adapter, not invented by UI. */
      answer: string
      grounding: []
    }

export interface DraftQuestionsInput {
  teacherId: UserId
  testId: TestId
  /** Requested number of questions. The adapter may return fewer. */
  count: number
  /** Optional teacher instruction, e.g. "focus on chain rule". */
  focus: string | null
}

export type DraftQuestionsResult =
  | {
      status: 'drafted'
      /** Persisted as draft questions of the test; editable and deletable in Stage 3. */
      questions: Question[]
      grounding: GroundingRef[]
    }
  | {
      status: 'no_grounding'
      questions: []
      grounding: []
      /** Explains why no questions could be grounded. Not shown as a guess. */
      message: string
    }
