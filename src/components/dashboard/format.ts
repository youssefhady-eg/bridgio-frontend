import type { TeacherDashboard, TestSummary } from '../../api/types'
import type { Lang } from '~/shell/lang'

/**
 * Display-only formatters for the teacher dashboard and the parent view.
 *
 * These are pure presentation helpers: they never fetch, never hold persistent
 * data, and never invent a value. All counts and dates arrive from the adapter.
 * Arabic renders Arabic-Indic digits and Arabic month names; English renders
 * Western digits and English month names. The underlying numbers stay untouched
 * for the API and for ARIA.
 */

const arabicDate = new Intl.DateTimeFormat('ar-EG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const englishDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const arabicNumber = new Intl.NumberFormat('ar-EG', {
  maximumFractionDigits: 0,
})

const westernNumber = new Intl.NumberFormat('en', {
  maximumFractionDigits: 0,
})

function numberFor(lang: Lang) {
  return lang === 'en' ? westernNumber : arabicNumber
}

/** Clamp a backend percentage into the 0–100 range the progress bar can show. */
export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, Math.round(value)))
}

/** Localised count, e.g. 3 → "٣" in Arabic, "3" in English. */
export function formatCount(value: number, lang: Lang = 'ar'): string {
  const formatter = numberFor(lang)
  if (!Number.isFinite(value)) return formatter.format(0)
  return formatter.format(Math.max(0, Math.round(value)))
}

/** Localised percentage, e.g. 64 → "٦٤٪" (ar) or "64%" (en). */
export function formatPercent(value: number, lang: Lang = 'ar'): string {
  const sign = lang === 'en' ? '%' : '٪'
  return `${formatCount(clampPercent(value), lang)}${sign}`
}

/** Localised Gregorian date; returns `fallback` for null or invalid input. */
export function formatDate(
  iso: string | null,
  fallback: string,
  lang: Lang = 'ar',
): string {
  if (!iso) return fallback
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return fallback
  return (lang === 'en' ? englishDate : arabicDate).format(date)
}

/**
 * The dashboard's two test lists, split by status so a test can never appear in
 * both: `attention` holds everything not yet published (drafts first), and
 * `activity` holds the published tests, newest first. Both are presentation-only
 * reorderings of the adapter's `recentTests`; no value is computed or invented.
 */
export interface DashboardTestLists {
  attention: TestSummary[]
  activity: TestSummary[]
}

export function splitDashboardTests(
  recentTests: readonly TestSummary[],
): DashboardTestLists {
  const activity = recentTests
    .filter((test) => test.status === 'published')
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
  const attention = recentTests
    .filter((test) => test.status !== 'published')
    .sort((left, right) => {
      if (left.status === 'draft' && right.status !== 'draft') return -1
      if (right.status === 'draft' && left.status !== 'draft') return 1
      return right.updatedAt.localeCompare(left.updatedAt)
    })
  return { attention, activity }
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
