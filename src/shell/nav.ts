/**
 * Stage 1 shell — role-aware navigation config.
 *
 * Nav sets come straight from the stage prompt / LIVE_RULES §2 and the token
 * sheet §5:
 *   teacher: Dashboard, My Classes, Tests, Students
 *   student: My Tests, Lessons, Progress
 *
 * The preview role (`?as=teacher|student`) is UI state only — a diagnostic to
 * see both navs before Mentingo auth exists. It is NOT an auth system, and no
 * identity is displayed (auth is owned by Mentingo, method unconfirmed).
 */

export type AppRole = 'teacher' | 'student'

export const appRoles: readonly AppRole[] = ['teacher', 'student'] as const

export type ScreenId =
  | 'shell-home'
  | 'teacher-dashboard'
  | 'teacher-classes'
  | 'teacher-tests'
  | 'teacher-students'
  | 'student-tests'
  | 'student-lessons'
  | 'student-progress'

export interface NavRoute {
  id: ScreenId
  /** Placeholder route — no feature screen is built behind it in Stage 1. */
  to: string
}

export const teacherNav: readonly NavRoute[] = [
  { id: 'teacher-dashboard', to: '/teacher/dashboard' },
  { id: 'teacher-classes', to: '/teacher/classes' },
  { id: 'teacher-tests', to: '/teacher/tests' },
  { id: 'teacher-students', to: '/teacher/students' },
] as const

export const studentNav: readonly NavRoute[] = [
  { id: 'student-tests', to: '/student/tests' },
  { id: 'student-lessons', to: '/student/lessons' },
  { id: 'student-progress', to: '/student/progress' },
] as const

export function navFor(role: AppRole): readonly NavRoute[] {
  return role === 'teacher' ? teacherNav : studentNav
}

/** Safe parse of the `?as` preview-role search param. */
export function parseAppRole(value: unknown): AppRole | undefined {
  return value === 'teacher' || value === 'student' ? value : undefined
}

/**
 * href for the preview-role switch that preserves the current path, so the
 * role can be toggled while staying on the same placeholder page.
 */
export function hrefWithRole(
  pathname: string,
  search: string,
  role: AppRole,
): string {
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search,
  )
  params.set('as', role)
  const qs = params.toString()
  return qs ? `${pathname}?${qs}` : pathname
}
