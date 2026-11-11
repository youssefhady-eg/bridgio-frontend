import { describe, expect, it } from 'vitest'
import {
  appRoles,
  defaultRoleForPath,
  assistantNav,
  hrefWithRole,
  navFor,
  parentNav,
  parseAppRole,
  studentNav,
  teacherNav,
} from './nav'

describe('shell nav', () => {
  it('teacher nav is Dashboard, My Classes, Tests, Students — in that order', () => {
    expect(teacherNav.map((item) => item.id)).toEqual([
      'teacher-dashboard',
      'teacher-classes',
      'teacher-tests',
      'teacher-students',
    ])
  })

  it('student nav is My Tests, Lessons, Progress — in that order', () => {
    expect(studentNav.map((item) => item.id)).toEqual([
      'student-tests',
      'student-lessons',
      'student-progress',
    ])
  })

  it('parent nav is Progress, Tests, Results, Messages — in that order', () => {
    expect(parentNav.map((item) => item.id)).toEqual([
      'parent-progress',
      'parent-tests',
      'parent-results',
      'parent-messages',
    ])
  })

  it('navFor returns the right set per role', () => {
    expect(navFor('teacher')).toBe(teacherNav)
    expect(navFor('student')).toBe(studentNav)
    expect(navFor('parent')).toBe(parentNav)
    expect(navFor('assistant')).toEqual([])
  })

  it('assistant nav is exactly the granted subset, in canonical order', () => {
    expect(assistantNav([]).map((item) => item.id)).toEqual([])
    expect(assistantNav(['tests']).map((item) => item.id)).toEqual([
      'teacher-tests',
    ])
    expect(assistantNav(['tests', 'dashboard']).map((item) => item.id)).toEqual([
      'teacher-dashboard',
      'teacher-tests',
    ])
    expect(
      assistantNav(['students', 'classes', 'tests', 'dashboard']).map(
        (item) => item.id,
      ),
    ).toEqual([
      'teacher-dashboard',
      'teacher-classes',
      'teacher-tests',
      'teacher-students',
    ])
  })

  it('every nav route has a unique path', () => {
    const all = [...teacherNav, ...studentNav, ...parentNav]
    const tos = all.map((item) => item.to)
    expect(new Set(tos).size).toBe(tos.length)
  })

  it('parses the ?as preview role strictly', () => {
    expect(appRoles).toEqual(['teacher', 'student', 'assistant', 'parent'])
    expect(parseAppRole('student')).toBe('student')
    expect(parseAppRole('teacher')).toBe('teacher')
    expect(parseAppRole('assistant')).toBe('assistant')
    expect(parseAppRole('parent')).toBe('parent')
    expect(parseAppRole('admin')).toBeUndefined()
    expect(parseAppRole(undefined)).toBeUndefined()
    expect(parseAppRole('')).toBeUndefined()
  })

  it('hrefWithRole keeps the current path and sets the role param', () => {
    expect(hrefWithRole('/teacher/tests', '', 'student')).toBe(
      '/teacher/tests?as=student',
    )
    expect(hrefWithRole('/student/progress', '?as=teacher', 'teacher')).toBe(
      '/student/progress?as=teacher',
    )
    expect(hrefWithRole('/parent/results', '?lang=en&as=teacher', 'parent')).toBe(
      '/parent/results?lang=en&as=parent',
    )
    expect(hrefWithRole('/', '?x=1&as=student', 'teacher')).toBe('/?x=1&as=teacher')
    expect(hrefWithRole('/', '?y=2', 'student')).toBe('/?y=2&as=student')
  })

  it('defaults the role from the route area when no ?as is given', () => {
    expect(defaultRoleForPath('/student/tests')).toBe('student')
    expect(defaultRoleForPath('/student')).toBe('student')
    expect(defaultRoleForPath('/parent/progress')).toBe('parent')
    expect(defaultRoleForPath('/teacher/dashboard')).toBe('teacher')
    expect(defaultRoleForPath('/')).toBe('teacher')
    expect(defaultRoleForPath('/does-not-exist')).toBe('teacher')
    // A path that only starts with the same letters is not the student area.
    expect(defaultRoleForPath('/students-archive')).toBe('teacher')
  })

  it('every student and parent nav destination defaults to its own role', () => {
    for (const item of studentNav) expect(defaultRoleForPath(item.to)).toBe('student')
    for (const item of parentNav) expect(defaultRoleForPath(item.to)).toBe('parent')
    for (const item of teacherNav) expect(defaultRoleForPath(item.to)).toBe('teacher')
  })

  it('routes the assistant area to the assistant role', () => {
    expect(defaultRoleForPath('/assistant')).toBe('assistant')
    expect(defaultRoleForPath('/assistants')).toBe('teacher')
  })

  it('points every granted assistant capability at the one grants screen', () => {
    const items = assistantNav(['students', 'classes', 'tests', 'dashboard'])
    expect(items.map((item) => item.to)).toEqual([
      '/assistant',
      '/assistant',
      '/assistant',
      '/assistant',
    ])
    expect(items.map((item) => item.hash)).toEqual([
      'dashboard',
      'classes',
      'tests',
      'students',
    ])
  })
})
