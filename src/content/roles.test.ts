import { describe, expect, it } from 'vitest'
import { ar, en } from './strings'
import { roleLabel } from './roles'

describe('gendered role label', () => {
  it('uses the female label for a female teacher', () => {
    expect(
      roleLabel(
        { role: 'teacher', gender: 'female' },
        ar.profile.roles,
        ar.profile.rolesFemale,
      ),
    ).toBe('المعلمة')
  })

  it('keeps the neutral label when the backend supplies no gender', () => {
    for (const gender of [null, 'male'] as const) {
      expect(
        roleLabel(
          { role: 'teacher', gender },
          ar.profile.roles,
          ar.profile.rolesFemale,
        ),
      ).toBe('المعلم')
    }
  })

  it('keeps English labels unchanged for both genders', () => {
    for (const gender of ['female', 'male', null] as const) {
      expect(
        roleLabel(
          { role: 'teacher', gender },
          en.profile.roles,
          en.profile.rolesFemale,
        ),
      ).toBe('Teacher')
    }
  })
})