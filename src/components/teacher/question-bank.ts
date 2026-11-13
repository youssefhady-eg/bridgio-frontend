import type { QuestionBankGroup } from '~/api/queries'
import type { ClassroomId, Question } from '~/api/types'

/**
 * Pure helpers for the teacher question bank.
 *
 * Filtering happens in the screen, over data the adapter already returned. No
 * value here is invented: the helpers only select, group and search the
 * questions of the teacher's tests.
 */

export interface QuestionBankFilter {
  /** `null` means every class. */
  classroomId: ClassroomId | null
  /** Free text over the prompt and every option. */
  query: string
}

export interface QuestionBankClassOption {
  id: ClassroomId
  name: string
}

/**
 * Light Arabic-aware normalisation for search: case-folding, removal of
 * diacritics/tatweel, and the common alef/ya/ta-marbuta variants. It is a
 * display aid only and never changes the stored question.
 */
export function normaliseSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[\u0623\u0625\u0622\u0671]/g, '\u0627')
    .replace(/\u0649/g, '\u064A')
    .replace(/\u0624/g, '\u0648')
    .replace(/\u0626/g, '\u064A')
    .replace(/\u0629/g, '\u0647')
    .replace(/\s+/g, ' ')
    .trim()
}

/** True when the prompt or any option contains the search text. */
export function questionMatches(question: Question, query: string): boolean {
  const needle = normaliseSearchText(query)
  if (needle === '') return true
  const haystack = normaliseSearchText(
    [question.prompt, ...question.options.map((option) => option.text)].join(' '),
  )
  return haystack.includes(needle)
}

/**
 * Apply the class and text filters. A test with no matching question is
 * dropped, so the screen never renders an empty section.
 */
export function filterQuestionBank(
  groups: readonly QuestionBankGroup[],
  filter: QuestionBankFilter,
): QuestionBankGroup[] {
  return groups
    .filter(
      (group) =>
        filter.classroomId === null ||
        group.test.classroomId === filter.classroomId,
    )
    .map((group) => ({
      test: group.test,
      questions: group.questions.filter((question) =>
        questionMatches(question, filter.query),
      ),
    }))
    .filter((group) => group.questions.length > 0)
}

/** Distinct classes represented in the bank, in first-seen order. */
export function questionBankClasses(
  groups: readonly QuestionBankGroup[],
): QuestionBankClassOption[] {
  const seen = new Map<ClassroomId, string>()
  for (const group of groups) {
    if (!seen.has(group.test.classroomId)) {
      seen.set(group.test.classroomId, group.test.classroomName)
    }
  }
  return [...seen].map(([id, name]) => ({ id, name }))
}

/** Totals for the filter summary. Counts only what the adapter returned. */
export function questionBankTotals(
  groups: readonly QuestionBankGroup[],
): { tests: number; questions: number } {
  return {
    tests: groups.length,
    questions: groups.reduce(
      (total, group) => total + group.questions.length,
      0,
    ),
  }
}
