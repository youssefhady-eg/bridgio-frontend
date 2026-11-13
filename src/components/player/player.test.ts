import { describe, expect, it } from 'vitest'
import type { Attempt, AttemptSummary, TestSummary } from '~/api/types'
import {
  answeredPercent,
  attemptForTest,
  attemptStateFor,
  clampIndex,
  dedupeTests,
  groundingScopeForTest,
  isLastQuestion,
  nextIndex,
  previousIndex,
  selectedOptionFor,
  unansweredCount,
} from './player'

function attemptSummary(input: {
  id: string
  testId: string
  status: AttemptSummary['status']
  updatedAt?: string
}): AttemptSummary {
  return {
    id: input.id,
    testId: input.testId,
    testTitle: `اختبار ${input.testId}`,
    classroomId: 'class_1',
    classroomName: 'الصف',
    status: input.status,
    answeredCount: 0,
    questionCount: 3,
    startedAt: '2026-11-03T10:00:00.000Z',
    submittedAt: input.status === 'submitted' ? '2026-11-03T11:00:00.000Z' : null,
  }
}

function attempt(input: {
  answers: Array<{ questionId: string; optionId: string | null }>
}): Attempt {
  return {
    ...attemptSummary({ id: 'attempt_1', testId: 'test_1', status: 'in_progress' }),
    studentId: 'usr_student_sara',
    answers: input.answers.map((answer) => ({
      questionId: answer.questionId,
      optionId: answer.optionId,
      answeredAt: answer.optionId ? '2026-11-03T10:05:00.000Z' : null,
    })),
    // Backend-supplied display data only; nothing in the player computes it.
    scorePercent: null,
  }
}

function test(input: { id: string; updatedAt: string }): TestSummary {
  return {
    id: input.id,
    title: `اختبار ${input.id}`,
    classroomId: 'class_1',
    classroomName: 'الصف',
    status: 'published',
    questionCount: 2,
    updatedAt: input.updatedAt,
    publishedAt: input.updatedAt,
  }
}

describe('player attempt lookup', () => {
  it('prefers an in-progress attempt over a submitted one for the same test', () => {
    const inProgress = attemptSummary({
      id: 'attempt_live',
      testId: 'test_1',
      status: 'in_progress',
    })
    const submitted = attemptSummary({
      id: 'attempt_done',
      testId: 'test_1',
      status: 'submitted',
    })
    expect(attemptForTest([submitted, inProgress], 'test_1')?.id).toBe(
      'attempt_live',
    )
  })

  it('returns null when the student has no attempt for the test', () => {
    expect(attemptForTest([], 'test_1')).toBeNull()
    expect(
      attemptForTest(
        [attemptSummary({ id: 'a', testId: 'test_2', status: 'submitted' })],
        'test_1',
      ),
    ).toBeNull()
  })

  it('maps an attempt to its player state', () => {
    expect(attemptStateFor(null)).toBe('new')
    expect(
      attemptStateFor(
        attemptSummary({ id: 'a', testId: 'test_1', status: 'in_progress' }),
      ),
    ).toBe('in_progress')
    expect(
      attemptStateFor(
        attemptSummary({ id: 'a', testId: 'test_1', status: 'submitted' }),
      ),
    ).toBe('submitted')
  })
})

describe('player question navigation', () => {
  it('clamps an index into the question range', () => {
    expect(clampIndex(-3, 3)).toBe(0)
    expect(clampIndex(0, 3)).toBe(0)
    expect(clampIndex(2, 3)).toBe(2)
    expect(clampIndex(9, 3)).toBe(2)
    expect(clampIndex(1.9, 3)).toBe(1)
    expect(clampIndex(0, 0)).toBe(0)
  })

  it('moves next and previous within bounds', () => {
    expect(nextIndex(0, 3)).toBe(1)
    expect(nextIndex(2, 3)).toBe(2)
    expect(previousIndex(2, 3)).toBe(1)
    expect(previousIndex(0, 3)).toBe(0)
  })

  it('detects the last question', () => {
    expect(isLastQuestion(0, 3)).toBe(false)
    expect(isLastQuestion(2, 3)).toBe(true)
    expect(isLastQuestion(0, 0)).toBe(true)
  })
})

describe('player progress', () => {
  it('computes the answered percent', () => {
    expect(answeredPercent(0, 3)).toBe(0)
    expect(answeredPercent(1, 3)).toBe(33)
    expect(answeredPercent(3, 3)).toBe(100)
    expect(answeredPercent(5, 3)).toBe(100)
    expect(answeredPercent(1, 0)).toBe(0)
  })

  it('reads the saved option for one question', () => {
    const loaded = attempt({
      answers: [
        { questionId: 'q_1', optionId: 'q_1_opt_1' },
        { questionId: 'q_2', optionId: null },
      ],
    })
    expect(selectedOptionFor(loaded, 'q_1')).toBe('q_1_opt_1')
    expect(selectedOptionFor(loaded, 'q_2')).toBeNull()
    expect(selectedOptionFor(loaded, 'q_missing')).toBeNull()
  })

  it('counts unanswered questions', () => {
    const loaded = attempt({
      answers: [
        { questionId: 'q_1', optionId: 'q_1_opt_1' },
        { questionId: 'q_2', optionId: null },
        { questionId: 'q_3', optionId: null },
      ],
    })
    expect(unansweredCount(loaded)).toBe(2)
  })
})

describe('player Mohsen scope', () => {
  it('grounds only in the test source', () => {
    expect(groundingScopeForTest('test_1')).toEqual({
      classroomId: null,
      testId: 'test_1',
      materialIds: [],
      unitId: null,
    })
  })
})

describe('player test list', () => {
  it('merges per-class lists, one row per test, newest first', () => {
    const older = test({ id: 'test_1', updatedAt: '2026-10-01T00:00:00.000Z' })
    const newer = test({ id: 'test_2', updatedAt: '2026-11-01T00:00:00.000Z' })
    const result = dedupeTests([older, newer, older])
    expect(result.map((item) => item.id)).toEqual(['test_2', 'test_1'])
  })
})
