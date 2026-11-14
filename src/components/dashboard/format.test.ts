import { describe, expect, it } from 'vitest'
import type { TeacherDashboard } from '../../api/types'
import {
  clampPercent,
  formatCount,
  formatDate,
  formatPercent,
  isDashboardEmpty,
  splitDashboardTests,
} from './format'

const emptyLists = {
  classes: [] as TeacherDashboard['classes'],
  recentTests: [] as TeacherDashboard['recentTests'],
  studentProgress: [] as TeacherDashboard['studentProgress'],
}

describe('dashboard format helpers', () => {
  it('clamps percentages into the progress-bar range', () => {
    expect(clampPercent(-12)).toBe(0)
    expect(clampPercent(0)).toBe(0)
    expect(clampPercent(63.6)).toBe(64)
    expect(clampPercent(100)).toBe(100)
    expect(clampPercent(180)).toBe(100)
    expect(clampPercent(Number.NaN)).toBe(0)
  })

  it('renders counts and percentages with Arabic-Indic digits', () => {
    expect(formatCount(3)).toMatch(/[٣3]/)
    expect(formatPercent(64)).toContain('٦٤')
    expect(formatPercent(150)).toContain('١٠٠')
  })

  it('formats ISO dates and falls back for null or invalid input', () => {
    const formatted = formatDate('2026-10-31T18:20:00.000Z', 'لا نشاط')
    expect(formatted).not.toBe('لا نشاط')
    expect(formatted).toMatch(/2026|٢٠٢٦/)
    expect(formatDate(null, 'لا نشاط')).toBe('لا نشاط')
    expect(formatDate('not-a-date', 'لا نشاط')).toBe('لا نشاط')
  })

  it('splits dashboard tests so no test is in both lists', () => {
    const summary = (
      id: string,
      status: TeacherDashboard['recentTests'][number]['status'],
      updatedAt: string,
    ) => ({
      id,
      title: id,
      classroomId: 'class_math',
      classroomName: 'Class',
      status,
      questionCount: 2,
      updatedAt,
      publishedAt: status === 'published' ? updatedAt : null,
    })

    const { attention, activity } = splitDashboardTests([
      summary('draft-old', 'draft', '2026-11-01T00:00:00.000Z'),
      summary('published-old', 'published', '2026-11-02T00:00:00.000Z'),
      summary('draft-new', 'draft', '2026-11-03T00:00:00.000Z'),
      summary('published-new', 'published', '2026-11-04T00:00:00.000Z'),
    ])

    expect(attention.map((item) => item.id)).toEqual([
      'draft-new',
      'draft-old',
    ])
    expect(activity.map((item) => item.id)).toEqual([
      'published-new',
      'published-old',
    ])
    expect(attention.every((item) => item.status !== 'published')).toBe(true)
    expect(activity.every((item) => item.status === 'published')).toBe(true)
    expect(
      attention.filter((item) =>
        activity.some((other) => other.id === item.id),
      ),
    ).toEqual([])
  })

  it('detects the page-level empty dashboard only when all three lists are empty', () => {
    expect(isDashboardEmpty(emptyLists)).toBe(true)
    expect(
      isDashboardEmpty({
        ...emptyLists,
        classes: [{}] as TeacherDashboard['classes'],
      }),
    ).toBe(false)
    expect(
      isDashboardEmpty({
        ...emptyLists,
        recentTests: [{}] as TeacherDashboard['recentTests'],
      }),
    ).toBe(false)
    expect(
      isDashboardEmpty({
        ...emptyLists,
        studentProgress: [{}] as TeacherDashboard['studentProgress'],
      }),
    ).toBe(false)
  })
})
