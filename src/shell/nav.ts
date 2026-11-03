/**
 * Role-aware navigation config — refinement branch.
 *
 * Nav sets come from the refinement brief:
 *   teacher   : Dashboard, My Classes, Tests, Students
 *   student   : My Tests, Lessons, Progress
 *   parent    : Progress, Tests, Results, Messages  (UI name "Parents")
 *   assistant : ONLY the items the backend/RBAC granted (no fixed menu)
 *
 * The preview role (`?as=teacher|student|assistant|parent`) is UI state only — a
 * diagnostic to see every nav before Mentingo auth exists. It is NOT an auth
 * system, and no identity is displayed (auth is owned by Mentingo, method
 * unconfirmed).
 */

import type { NavCapability } from '~/api/types'

export type AppRole = 'teacher' | 'student' | 'assistant' | 'parent'

export const appRoles: readonly AppRole[] = [
  'teacher',
  'student',
  'assistant',
  'parent',
] as const

/** The eleven nav destinations (never the shell home). */
export type NavScreenId =
  | 'teacher-dashboard'
  | 'teacher-classes'
  | 'teacher-tests'
  | 'teacher-students'
  | 'student-tests'
  | 'student-lessons'
  | 'student-progress'
  | 'parent-progress'
  | 'parent-tests'
  | 'parent-results'
  | 'parent-messages'

export interface NavRoute {
  id: NavScreenId
  /** Placeholder or real route opened by this nav item. */
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

export const parentNav: readonly NavRoute[] = [
  { id: 'parent-progress', to: '/parent/progress' },
  { id: 'parent-tests', to: '/parent/tests' },
  { id: 'parent-results', to: '/parent/results' },
  { id: 'parent-messages', to: '/parent/messages' },
] as const

/**
 * Teacher Assistant capabilities → the matching teacher route. The assistant
 * has no menu of its own: the sidebar renders exactly the granted subset, in
 * this fixed order. A capability the backend did not grant is simply absent.
 */
export const assistantCapabilityOrder: readonly NavCapability[] = [
  'dashboard',
  'classes',
  'tests',
  'students',
] as const

export const assistantCapabilityRoutes: Record<NavCapability, NavRoute> = {
  dashboard: teacherNav[0]!,
  classes: teacherNav[1]!,
  tests: teacherNav[2]!,
  students: teacherNav[3]!,
}

/**
 * Nav for the Teacher Assistant: only the granted capabilities, in canonical
 * order. Empty grants yield an empty menu (the sidebar then says so) — the
 * frontend never invents an item.
 */
export function assistantNav(
  capabilities: readonly NavCapability[],
): readonly NavRoute[] {
  const granted = new Set(capabilities)
  return assistantCapabilityOrder
    .filter((capability) => granted.has(capability))
    .map((capability) => assistantCapabilityRoutes[capability])
}

/** Nav set for a role. Assistants must pass their backend-granted capabilities. */
export function navFor(
  role: AppRole,
  capabilities: readonly NavCapability[] = [],
): readonly NavRoute[] {
  switch (role) {
    case 'teacher':
      return teacherNav
    case 'student':
      return studentNav
    case 'parent':
      return parentNav
    case 'assistant':
      return assistantNav(capabilities)
  }
}

/** Safe parse of the `?as` preview-role search param. */
export function parseAppRole(value: unknown): AppRole | undefined {
  return value === 'teacher' ||
    value === 'student' ||
    value === 'assistant' ||
    value === 'parent'
    ? value
    : undefined
}

/**
 * href for the preview-role switch that preserves the current path and the
 * other params (including the language), so the role can be toggled while
 * staying on the same page.
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
