import type { TeacherDashboard } from '../../api/types'

/**
 * Display-only formatters for the teacher dashboard.
 *
 * These are pure presentation helpers: they never fetch, never hold persistent
 * data, and never invent a value. All counts and dates arrive from the adapter.
 * Arabic-Indic digits and Arabic month names keep the screen Arabic-first; the
 * underlying numbers stay untouched for the API and for ARIA.
 */

const arabicDate = new Intl.DateTimeFormat('ar-EG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const arabicNumber = new Intl.NumberFormat('ar-EG', {
  maximumFractionDigits: 0,
})

/** Clamp a backend percentage into the 0–100 range the progress bar can show. */
export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, Math.round(value)))
}

/** Localised count, e.g. 3 → "٣". */
export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return arabicNumber.format(0)
  return arabicNumber.format(Math.max(0, Math.round(value)))
}

/** Localised percentage, e.g. 64 → "٦٤٪". */
export function formatPercent(value: number): string {
  return `${formatCount(clampPercent(value))}٪`
}

/** Localised Gregorian date; returns `fallback` for null or invalid input. */
export function formatDate(iso: string | null, fallback: string): string {
  if (!iso) return fallback
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return fallback
  return arabicDate.format(date)
}

/**
 * True when the dashboard has no classes, no tests and no student progress —
 * the page-level empty state. Section-level empty states are handled separately
 * so one missing list never hides the others.
 */
export function isDashboardEmpty(
  dashboard: Pick<
    TeacherDashboard,
    'classes' | 'recentTests' | 'studentProgress'
  >,
): boolean {
  return (
    dashboard.classes.length === 0 &&
    dashboard.recentTests.length === 0 &&
    dashboard.studentProgress.length === 0
  )
}
