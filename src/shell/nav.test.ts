import { describe, expect, it } from 'vitest'
import {
  appRoles,
  hrefWithRole,
  navFor,
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

  it('navFor returns the right set per role', () => {
    expect(navFor('teacher')).toBe(teacherNav)
    expect(navFor('student')).toBe(studentNav)
  })

  it('every nav route has a unique placeholder path', () => {
    const all = [...teacherNav, ...studentNav]
    const tos = all.map((item) => item.to)
    expect(new Set(tos).size).toBe(tos.length)
    for (const item of all) {
      expect(item.to.startsWith('/teacher/')).toBe(item.to.startsWith('/teacher/'))
    }
  })

  it('parses the ?as preview role strictly', () => {
    expect(appRoles).toEqual(['teacher', 'student'])
    expect(parseAppRole('student')).toBe('student')
    expect(parseAppRole('teacher')).toBe('teacher')
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
    expect(hrefWithRole('/', '?x=1&as=student', 'teacher')).toBe('/?x=1&as=teacher')
    expect(hrefWithRole('/', '?y=2', 'student')).toBe('/?y=2&as=student')
  })
})
