import { describe, expect, it } from 'vitest'
import type { QuestionBankGroup } from '~/api/queries'
import type { Question, TestSummary } from '~/api/types'
import {
  filterQuestionBank,
  normaliseSearchText,
  questionBankClasses,
  questionBankTotals,
  questionMatches,
} from './question-bank'

function question(
  id: string,
  prompt: string,
  options: string[] = [],
): Question {
  return {
    id,
    testId: 'test-1',
    order: 1,
    prompt,
    options: options.map((text, index) => ({ id: `${id}-o${index}`, text })),
    correctOptionId: null,
    grounding: [],
    origin: 'teacher',
    createdAt: '2026-11-01T00:00:00.000Z',
    updatedAt: '2026-11-01T00:00:00.000Z',
  }
}

function test(id: string, classroomId: string, classroomName: string): TestSummary {
  return {
    id,
    title: `Test ${id}`,
    classroomId,
    classroomName,
    status: 'draft',
    questionCount: 0,
    updatedAt: '2026-11-01T00:00:00.000Z',
    publishedAt: null,
  }
}

const groups: QuestionBankGroup[] = [
  {
    test: test('test-a', 'class-1', 'الصف الأول'),
    questions: [
      question('q1', 'ما مشتقة الدالة x²؟', ['2x', 'x']),
      question('q2', 'ما مشتقة أي دالة ثابتة؟', ['1', '0']),
    ],
  },
  {
    test: test('test-b', 'class-2', 'الصف الثاني'),
    questions: [question('q3', 'كيف نحسب السرعة المتوسطة؟', ['الإزاحة ÷ الزمن'])],
  },
]

describe('question bank helpers', () => {
  it('normalises Arabic variants and removes diacritics', () => {
    expect(normaliseSearchText('مَشْتَقَّة')).toBe('مشتقه')
    expect(normaliseSearchText('الإزاحة')).toBe('الازاحه')
    expect(normaliseSearchText('  عدة   أسئلة ')).toBe('عده اسيله')
  })

  it('matches the prompt and every option', () => {
    expect(questionMatches(groups[0]!.questions[0]!, 'x²')).toBe(true)
    expect(questionMatches(groups[0]!.questions[0]!, '٢x')).toBe(false)
    expect(questionMatches(groups[0]!.questions[1]!, 'ثابتة')).toBe(true)
    expect(questionMatches(groups[1]!.questions[0]!, 'الازاحة')).toBe(true)
    expect(questionMatches(groups[1]!.questions[0]!, 'العجلة')).toBe(false)
  })

  it('filters by class and search together, dropping empty groups', () => {
    const filtered = filterQuestionBank(groups, {
      classroomId: 'class-1',
      query: 'مشتقة',
    })
    expect(filtered.map((group) => group.test.id)).toEqual(['test-a'])
    expect(filtered[0]!.questions.map((item) => item.id)).toEqual(['q1', 'q2'])

    const narrowed = filterQuestionBank(groups, {
      classroomId: 'class-1',
      query: 'ثابتة',
    })
    expect(narrowed).toHaveLength(1)
    expect(narrowed[0]!.questions.map((item) => item.id)).toEqual(['q2'])

    expect(
      filterQuestionBank(groups, { classroomId: null, query: 'غير موجود' }),
    ).toEqual([])
  })

  it('returns every group for an empty filter', () => {
    expect(
      filterQuestionBank(groups, { classroomId: null, query: '   ' }),
    ).toHaveLength(2)
  })

  it('lists distinct classes in first-seen order', () => {
    expect(questionBankClasses(groups)).toEqual([
      { id: 'class-1', name: 'الصف الأول' },
      { id: 'class-2', name: 'الصف الثاني' },
    ])
    expect(questionBankClasses([])).toEqual([])
  })

  it('counts tests and questions from the supplied groups only', () => {
    expect(questionBankTotals(groups)).toEqual({ tests: 2, questions: 3 })
    expect(questionBankTotals([])).toEqual({ tests: 0, questions: 0 })
  })
})
