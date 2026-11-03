import { describe, expect, it } from 'vitest'
import type { Question } from '~/api/types'
import {
  BUILDER_STEPS,
  canEnterStep,
  clampStep,
  correctIndexFor,
  nextStep,
  previousStep,
  publishGate,
  questionDraftIssue,
  removeQuestion,
  replaceQuestion,
  sourceDraftIssue,
} from './builder'

function question(input: {
  id: string
  order: number
  prompt?: string
  correctOptionId?: string | null
}): Question {
  return {
    id: input.id,
    testId: 'test_1',
    order: input.order,
    prompt: input.prompt ?? `سؤال ${input.order}`,
    options: [
      { id: `${input.id}_opt_1`, text: 'أ' },
      { id: `${input.id}_opt_2`, text: 'ب' },
    ],
    correctOptionId:
      input.correctOptionId === undefined
        ? `${input.id}_opt_1`
        : input.correctOptionId,
    grounding: [],
    origin: 'mohsen',
    createdAt: '2026-11-03T10:00:00.000Z',
    updatedAt: '2026-11-03T10:00:00.000Z',
  }
}

describe('builder step flow', () => {
  it('has exactly the four Stage 3 steps', () => {
    expect(BUILDER_STEPS).toEqual([1, 2, 3, 4])
  })

  it('moves next and previous within bounds', () => {
    expect(nextStep(1)).toBe(2)
    expect(nextStep(3)).toBe(4)
    expect(nextStep(4)).toBe(4)
    expect(previousStep(4)).toBe(3)
    expect(previousStep(2)).toBe(1)
    expect(previousStep(1)).toBe(1)
    expect(clampStep(0)).toBe(1)
    expect(clampStep(9)).toBe(4)
  })

  it('only opens steps 2–4 once a draft exists', () => {
    expect(canEnterStep(1, { hasDraft: false, published: false })).toBe(true)
    expect(canEnterStep(2, { hasDraft: false, published: false })).toBe(false)
    expect(canEnterStep(4, { hasDraft: false, published: false })).toBe(false)
    expect(canEnterStep(2, { hasDraft: true, published: false })).toBe(true)
    expect(canEnterStep(4, { hasDraft: true, published: false })).toBe(true)
    expect(canEnterStep(4, { hasDraft: true, published: true })).toBe(true)
    expect(canEnterStep(3, { hasDraft: true, published: true })).toBe(false)
    expect(canEnterStep(1, { hasDraft: true, published: true })).toBe(false)
  })
})

describe('builder publish gate', () => {
  it('blocks without a test', () => {
    expect(
      publishGate({
        testId: null,
        classroomId: 'class_1',
        questionCount: 2,
        status: null,
      }),
    ).toEqual({ allowed: false, reason: 'no_test' })
  })

  it('blocks honestly when there is no class', () => {
    expect(
      publishGate({
        testId: 'test_1',
        classroomId: null,
        questionCount: 2,
        status: 'draft',
      }),
    ).toEqual({ allowed: false, reason: 'no_class' })
  })

  it('blocks honestly when there is no question', () => {
    expect(
      publishGate({
        testId: 'test_1',
        classroomId: 'class_1',
        questionCount: 0,
        status: 'draft',
      }),
    ).toEqual({ allowed: false, reason: 'no_questions' })
  })

  it('blocks a test that is already published', () => {
    expect(
      publishGate({
        testId: 'test_1',
        classroomId: 'class_1',
        questionCount: 3,
        status: 'published',
      }),
    ).toEqual({ allowed: false, reason: 'already_published' })
  })

  it('allows a draft with a class and at least one question', () => {
    expect(
      publishGate({
        testId: 'test_1',
        classroomId: 'class_1',
        questionCount: 1,
        status: 'draft',
      }),
    ).toEqual({ allowed: true })
  })
})

describe('builder step 1 validation', () => {
  const valid = {
    classroomId: 'class_1',
    title: 'مراجعة التفاضل',
    sourceKind: 'material' as const,
    materialId: 'material_1',
    unitId: '',
  }

  it('requires a class, a title and a source', () => {
    expect(sourceDraftIssue({ ...valid, classroomId: '' })).toBe('classroom')
    expect(sourceDraftIssue({ ...valid, title: '   ' })).toBe('title')
    expect(sourceDraftIssue({ ...valid, materialId: '' })).toBe('source')
    expect(
      sourceDraftIssue({
        ...valid,
        sourceKind: 'curriculum_unit',
        unitId: '',
      }),
    ).toBe('source')
  })

  it('accepts a material or a curriculum unit', () => {
    expect(sourceDraftIssue(valid)).toBeNull()
    expect(
      sourceDraftIssue({
        ...valid,
        sourceKind: 'curriculum_unit',
        materialId: '',
        unitId: 'unit_1',
      }),
    ).toBeNull()
  })
})

describe('builder question editor', () => {
  it('validates prompt, options and the selected answer', () => {
    expect(
      questionDraftIssue({ prompt: '', options: ['أ', 'ب'], correctIndex: 0 }),
    ).toBe('prompt')
    expect(
      questionDraftIssue({
        prompt: 'سؤال',
        options: ['أ'],
        correctIndex: 0,
      }),
    ).toBe('options')
    expect(
      questionDraftIssue({
        prompt: 'سؤال',
        options: ['أ', '  '],
        correctIndex: 0,
      }),
    ).toBe('options')
    expect(
      questionDraftIssue({
        prompt: 'سؤال',
        options: ['أ', 'ب', 'ج', 'د', 'ه', 'و', 'ز'],
        correctIndex: 0,
      }),
    ).toBe('options')
    expect(
      questionDraftIssue({
        prompt: 'سؤال',
        options: ['أ', 'أ'],
        correctIndex: 0,
      }),
    ).toBe('options')
    expect(
      questionDraftIssue({
        prompt: 'سؤال',
        options: ['أ', 'ب'],
        correctIndex: 5,
      }),
    ).toBe('correct')
  })

  it('accepts two to six filled options and an unset answer', () => {
    expect(
      questionDraftIssue({
        prompt: 'سؤال',
        options: ['أ', 'ب'],
        correctIndex: 1,
      }),
    ).toBeNull()
    expect(
      questionDraftIssue({
        prompt: 'سؤال',
        options: ['أ', 'ب'],
        correctIndex: null,
      }),
    ).toBeNull()
  })

  it('maps authoring metadata back to a 0-based index', () => {
    const item = question({ id: 'q_1', order: 1 })
    expect(correctIndexFor(item)).toBe(0)
    expect(
      correctIndexFor({ ...item, correctOptionId: 'q_1_opt_2' }),
    ).toBe(1)
    expect(correctIndexFor({ ...item, correctOptionId: null })).toBeNull()
  })

  it('replaces an edited question and keeps display order', () => {
    const first = question({ id: 'q_1', order: 1 })
    const second = question({ id: 'q_2', order: 2 })
    const edited = { ...second, prompt: 'سؤال معدّل', order: 2 }

    const result = replaceQuestion([first, second], edited)
    expect(result[1]?.prompt).toBe('سؤال معدّل')
    expect(result.map((item) => item.order)).toEqual([1, 2])
  })

  it('removes a question and renumbers the rest', () => {
    const first = question({ id: 'q_1', order: 1 })
    const second = question({ id: 'q_2', order: 2 })
    const third = question({ id: 'q_3', order: 3 })

    const result = removeQuestion([first, second, third], 'q_2')
    expect(result.map((item) => item.id)).toEqual(['q_1', 'q_3'])
    expect(result.map((item) => item.order)).toEqual([1, 2])
  })
})
