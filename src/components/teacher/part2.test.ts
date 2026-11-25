import { describe, expect, it } from 'vitest'
import type { QuestionBankGroup } from '~/api/queries'
import type { Question, StudentProgressSnapshot, TestSummary } from '~/api/types'
import { newestDraft } from './question-bank'
import { dedupeByStudent } from './students'
import { difficultyTone, masteryTone, scoreBarHeight, scoreText } from './tones'

/**
 * Part 2 (2026-11-22) — tests for the new pure helpers the rebuilt teacher views
 * introduced. No existing assertion is changed or weakened.
 */

describe('masteryTone', () => {
  it('follows the demo thresholds: 75 success, 55 warning, below danger', () => {
    expect(masteryTone(100)).toBe('success')
    expect(masteryTone(75)).toBe('success')
    expect(masteryTone(74)).toBe('warning')
    expect(masteryTone(55)).toBe('warning')
    expect(masteryTone(54)).toBe('danger')
    expect(masteryTone(0)).toBe('danger')
  })
})

describe('difficultyTone', () => {
  it('has its own mapping, not the mastery rule', () => {
    expect(difficultyTone('easy')).toBe('success')
    expect(difficultyTone('medium')).toBe('warning')
    expect(difficultyTone('hard')).toBe('danger')
  })
})

describe('scoreText', () => {
  it('renders an unavailable label for a null score, never 0%', () => {
    expect(scoreText(null, 'en', 'Not scored yet')).toBe('Not scored yet')
  })

  it('renders a localised percentage for a real score', () => {
    expect(scoreText(67, 'en', 'Not scored yet')).toBe('67%')
    expect(scoreText(0, 'en', 'Not scored yet')).toBe('0%')
  })
})

describe('scoreBarHeight', () => {
  it('scales a score into the 58 px plot the demo drawer uses', () => {
    expect(scoreBarHeight(100)).toBe(58)
    expect(scoreBarHeight(64)).toBe(37)
    expect(scoreBarHeight(0)).toBe(3)
  })

  it('clamps out-of-range values instead of producing a broken bar', () => {
    expect(scoreBarHeight(-10)).toBe(3)
    expect(scoreBarHeight(140)).toBe(58)
  })
})

function progressRow(
  studentId: string,
  classroomId: string,
  progressPercent: number,
): StudentProgressSnapshot {
  return {
    student: {
      id: studentId,
      displayName: studentId,
      role: 'student',
      email: `${studentId}@example.test`,
      gender: null,
      avatarUrl: null,
    },
    classroomId,
    classroomName: classroomId,
    progressPercent,
    completedUnits: 0,
    totalUnits: 1,
    lastActiveAt: null,
    lastScorePercent: null,
  }
}

describe('dedupeByStudent', () => {
  it('keeps the enrolment with the lowest progress and the input order', () => {
    const rows = [
      progressRow('student_a', 'class_1', 70),
      progressRow('student_b', 'class_1', 40),
      progressRow('student_a', 'class_2', 30),
    ]

    const deduped = dedupeByStudent(rows)

    expect(deduped.map((row) => row.student.id)).toEqual([
      'student_a',
      'student_b',
    ])
    expect(deduped[0]?.classroomId).toBe('class_2')
    expect(deduped[0]?.progressPercent).toBe(30)
  })

  it('returns an empty list unchanged', () => {
    expect(dedupeByStudent([])).toEqual([])
  })
})

function testSummary(
  id: string,
  status: TestSummary['status'],
  updatedAt: string,
): TestSummary {
  return {
    id,
    title: id,
    classroomId: 'class_1',
    classroomName: 'Class',
    status,
    questionCount: 0,
    updatedAt,
    publishedAt: status === 'published' ? updatedAt : null,
    durationMinutes: null,
  }
}

function group(summary: TestSummary): QuestionBankGroup {
  return { test: summary, questions: [] as Question[] }
}

describe('newestDraft', () => {
  it('returns the most recently updated draft, ignoring published tests', () => {
    const groups = [
      group(testSummary('draft-old', 'draft', '2026-11-01T00:00:00.000Z')),
      group(testSummary('published-new', 'published', '2026-11-09T00:00:00.000Z')),
      group(testSummary('draft-new', 'draft', '2026-11-05T00:00:00.000Z')),
    ]

    expect(newestDraft(groups)?.test.id).toBe('draft-new')
  })

  it('returns null when the teacher has no draft', () => {
    const groups = [
      group(testSummary('published', 'published', '2026-11-05T00:00:00.000Z')),
    ]

    expect(newestDraft(groups)).toBeNull()
  })
})