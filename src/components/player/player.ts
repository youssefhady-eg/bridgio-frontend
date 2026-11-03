import type {
  Attempt,
  AttemptSummary,
  GroundingScope,
  TestSummary,
} from '~/api/types'

/**
 * Stage 4 student test-player logic — pure and UI-independent so question
 * navigation, progress and the submit gate can be unit-tested without a browser.
 *
 * Persistent data (the attempt, its saved answers, the published tests) always
 * lives in the adapter. The helpers here only reason over values the adapter
 * returned, and never mark or score anything.
 */

export type AttemptState = 'new' | 'in_progress' | 'submitted'

/**
 * The attempt that represents a student on a given test. The mock allows one
 * attempt per test per student; an unsubmitted attempt always wins over a stale
 * submitted record so "resume" is shown whenever there is still work to do.
 */
export function attemptForTest(
  attempts: readonly AttemptSummary[],
  testId: string,
): AttemptSummary | null {
  const matches = attempts.filter((attempt) => attempt.testId === testId)
  return matches.find((attempt) => attempt.status === 'in_progress') ?? matches[0] ?? null
}

export function attemptStateFor(attempt: AttemptSummary | null): AttemptState {
  if (!attempt) return 'new'
  return attempt.status === 'submitted' ? 'submitted' : 'in_progress'
}

/** Clamp a question index into `[0, count - 1]`; an empty test clamps to 0. */
export function clampIndex(index: number, count: number): number {
  if (count <= 0) return 0
  if (!Number.isFinite(index) || index < 0) return 0
  if (index >= count) return count - 1
  return Math.trunc(index)
}

export function nextIndex(index: number, count: number): number {
  return clampIndex(index + 1, count)
}

export function previousIndex(index: number, count: number): number {
  return clampIndex(index - 1, count)
}

export function isLastQuestion(index: number, count: number): boolean {
  return count === 0 || index >= count - 1
}

/** Answered share as a whole 0–100 percent for the progress bar. */
export function answeredPercent(
  answeredCount: number,
  questionCount: number,
): number {
  if (questionCount <= 0) return 0
  return Math.min(
    100,
    Math.max(0, Math.round((answeredCount / questionCount) * 100)),
  )
}

/** The saved option for one question, or null when the student has not chosen. */
export function selectedOptionFor(
  attempt: Attempt,
  questionId: string,
): string | null {
  return (
    attempt.answers.find((answer) => answer.questionId === questionId)
      ?.optionId ?? null
  )
}

/** Count of questions still unanswered in the attempt, from the adapter data. */
export function unansweredCount(attempt: Attempt): number {
  return attempt.answers.filter((answer) => answer.optionId === null).length
}

/**
 * Mohsen scope for a player screen. Grounded to the test's own source only, so
 * answers come from the material/unit the test was built on — never invented and
 * never widened to unrelated class content.
 */
export function groundingScopeForTest(testId: string): GroundingScope {
  return { classroomId: null, testId, materialIds: [], unitId: null }
}

/** Merge per-class test lists into one newest-first list, one row per test. */
export function dedupeTests(tests: readonly TestSummary[]): TestSummary[] {
  const byId = new Map<string, TestSummary>()
  for (const test of tests) {
    if (!byId.has(test.id)) byId.set(test.id, test)
  }
  return [...byId.values()].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  )
}
