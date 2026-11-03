import { describe, expect, it } from 'vitest'
import type { TeacherDashboard } from '../../api/types'
import {
  clampPercent,
  formatCount,
  formatDate,
  formatPercent,
  isDashboardEmpty,
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
