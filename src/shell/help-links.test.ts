import { describe, expect, it } from 'vitest'
import { ar, en, type Strings } from '~/content/strings'
import { linkRoutes, linkSearchRole } from './help-links'
import type { AppRole } from './nav'

/**
 * Help Center and Guide links must land on real screens: the copy names a link
 * id, this module owns the URL. A missing route would silently drop the button,
 * so both languages are checked against the same map.
 */

const guideRoles: readonly AppRole[] = [
  'teacher',
  'student',
  'parent',
  'assistant',
]

function copyLinkIds(copy: Strings): string[] {
  const ids = Object.values(copy.help.articles).flatMap((article) =>
    article.link ? [article.link] : [],
  )
  for (const role of guideRoles) {
    ids.push(...copy.guide[role].steps.map((step) => step.link))
  }
  return ids
}

describe('help links', () => {
  it('resolves every link id used in the copy to a real path', () => {
    for (const copy of [ar, en]) {
      const ids = copyLinkIds(copy)
      expect(ids.length).toBeGreaterThan(0)
      for (const id of ids) {
        // The cast is deliberate: the test stands in for copy that references
        // an id the map does not know.
        expect(linkRoutes[id as keyof typeof linkRoutes]).toMatch(/^\//)
      }
    }
  })

  it('keeps the current role on a shared screen and the area role elsewhere', () => {
    expect(linkSearchRole('/profile', 'student')).toBe('student')
    expect(linkSearchRole('/profile', 'assistant')).toBe('assistant')

    expect(linkSearchRole('/teacher/classes', 'student')).toBe('teacher')
    expect(linkSearchRole('/student/tests', 'teacher')).toBe('student')
    expect(linkSearchRole('/parent/progress', 'teacher')).toBe('parent')
    expect(linkSearchRole('/assistant', 'teacher')).toBe('assistant')
  })
})
