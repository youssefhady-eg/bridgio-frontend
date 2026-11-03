import type { Question, TestStatus } from '~/api/types'

/**
 * Stage 3 test-builder logic — pure and UI-independent so the flow, the
 * publish gate and the editor rules can be unit-tested without a browser.
 *
 * Persistent data (the draft test, its questions, grounding) always lives in
 * the adapter. The helpers here only reason over values the adapter returned.
 */

export const BUILDER_STEPS = [1, 2, 3, 4] as const

export type BuilderStep = (typeof BUILDER_STEPS)[number]

export type BuilderMove = 'next' | 'previous'

export function isBuilderStep(value: number): value is BuilderStep {
  return BUILDER_STEPS.includes(value as BuilderStep)
}

/** Clamp a step into the four-step builder range. */
export function clampStep(value: number): BuilderStep {
  if (value <= 1) return 1
  if (value >= 4) return 4
  return value as BuilderStep
}

export function nextStep(step: BuilderStep): BuilderStep {
  return clampStep(step + 1)
}

export function previousStep(step: BuilderStep): BuilderStep {
  return clampStep(step - 1)
}

/**
 * Steps 2–4 need a persisted draft test: Mohsen drafts into that test and the
 * review/publish steps read its questions. Step 1 is always available because
 * it is where the draft is created (or restarted).
 */
export function canEnterStep(
  target: BuilderStep,
  context: { hasDraft: boolean; published: boolean },
): boolean {
  if (context.published) return target === 4
  if (target === 1) return true
  return context.hasDraft
}

export type PublishBlockReason =
  | 'no_test'
  | 'no_class'
  | 'no_questions'
  | 'already_published'

export type PublishGate =
  | { allowed: true }
  | { allowed: false; reason: PublishBlockReason }

/**
 * Publish gating for step 4. Every reason has honest teacher copy in
 * `ar.builder.publish.blocked`; the UI never disables publishing silently.
 */
export function publishGate(input: {
  testId: string | null
  classroomId: string | null
  questionCount: number
  status: TestStatus | null
}): PublishGate {
  if (!input.testId || !input.status) {
    return { allowed: false, reason: 'no_test' }
  }
  if (!input.classroomId) {
    return { allowed: false, reason: 'no_class' }
  }
  if (input.questionCount < 1) {
    return { allowed: false, reason: 'no_questions' }
  }
  if (input.status === 'published') {
    return { allowed: false, reason: 'already_published' }
  }
  return { allowed: true }
}

/** Step 1 validation before `tests.createDraft` is called. */
export type SourceDraftIssue = 'classroom' | 'title' | 'source'

export function sourceDraftIssue(input: {
  classroomId: string
  title: string
  sourceKind: 'material' | 'curriculum_unit'
  materialId: string
  unitId: string
}): SourceDraftIssue | null {
  if (!input.classroomId) return 'classroom'
  if (!input.title.trim()) return 'title'
  if (input.sourceKind === 'material' && !input.materialId) return 'source'
  if (input.sourceKind === 'curriculum_unit' && !input.unitId) return 'source'
  return null
}

export interface QuestionDraft {
  prompt: string
  /** Two to six option labels, in display order. */
  options: string[]
  /** Index into `options`, or null when the teacher leaves it unset. */
  correctIndex: number | null
}

export type QuestionDraftIssue = 'prompt' | 'options' | 'correct'

export function questionDraftIssue(
  draft: QuestionDraft,
): QuestionDraftIssue | null {
  if (!draft.prompt.trim()) return 'prompt'
  const options = draft.options.map((option) => option.trim())
  if (
    options.length < 2 ||
    options.length > 6 ||
    options.some((option) => option.length === 0) ||
    new Set(options.map((option) => option.toLowerCase())).size !==
      options.length
  ) {
    return 'options'
  }
  if (
    draft.correctIndex !== null &&
    (draft.correctIndex < 0 || draft.correctIndex >= options.length)
  ) {
    return 'correct'
  }
  return null
}

/** Convert the authoring metadata back into a 0-based editor index. */
export function correctIndexFor(question: Pick<Question, 'options' | 'correctOptionId'>): number | null {
  const index = question.options.findIndex(
    (option) => option.id === question.correctOptionId,
  )
  return index === -1 ? null : index
}

/** Update one question in an ordered list, keeping display order stable. */
export function replaceQuestion(
  questions: readonly Question[],
  updated: Question,
): Question[] {
  return questions
    .map((question) => (question.id === updated.id ? updated : question))
    .sort((left, right) => left.order - right.order)
}

/** Remove one question and renumber the remaining cards from 1. */
export function removeQuestion(
  questions: readonly Question[],
  questionId: string,
): Question[] {
  return questions
    .filter((question) => question.id !== questionId)
    .map((question, index) => ({ ...question, order: index + 1 }))
}
