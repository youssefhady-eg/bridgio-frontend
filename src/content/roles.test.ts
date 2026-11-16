import { describe, expect, it } from 'vitest'
import { ar, en } from './strings'
import {
  dashboardLabel,
  dashboardLinkLabel,
  dashboardNavLabel,
  roleLabel,
} from './roles'

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

describe('gendered dashboard heading', () => {
  it('uses the female heading for a female user', () => {
    expect(dashboardLabel({ gender: 'female' }, ar.dashboard)).toBe(
      'لوحة المعلمة',
    )
  })

  it('keeps the neutral heading when the backend supplies no gender', () => {
    for (const gender of [null, 'male'] as const) {
      expect(dashboardLabel({ gender }, ar.dashboard)).toBe('لوحة المعلم')
    }
  })

  it('keeps the English heading unchanged for both genders', () => {
    for (const gender of ['female', 'male', null] as const) {
      expect(dashboardLabel({ gender }, en.dashboard)).toBe(
        'Teacher dashboard',
      )
    }
  })
})

describe('dashboard name inside a sentence', () => {
  it('uses the female name for a female session user', () => {
    expect(dashboardLinkLabel({ gender: 'female' }, ar.dashboard)).toBe(
      'لوحة المعلمة',
    )
  })

  it('uses the neutral teacher name for a non-female session user', () => {
    for (const gender of [null, 'male'] as const) {
      expect(dashboardLinkLabel({ gender }, ar.dashboard)).toBe('لوحة المعلم')
    }
  })

  it('falls back to the neutral dashboard name with no session', () => {
    expect(dashboardLinkLabel(null, ar.dashboard)).toBe('لوحة التحكم')
  })

  it('keeps English unchanged and falls back to the neutral name', () => {
    for (const gender of ['female', 'male', null] as const) {
      expect(dashboardLinkLabel({ gender }, en.dashboard)).toBe(
        'Teacher dashboard',
      )
    }
    expect(dashboardLinkLabel(null, en.dashboard)).toBe('Dashboard')
  })
})

describe('short sidebar dashboard label', () => {
  it('keeps the gendered Arabic label', () => {
    expect(dashboardNavLabel({ gender: 'female' }, ar.dashboard)).toBe(
      'لوحة المعلمة',
    )
    expect(dashboardNavLabel({ gender: null }, ar.dashboard)).toBe(
      'لوحة المعلم',
    )
  })

  it('uses the one-word English label for both genders', () => {
    for (const gender of ['female', 'male', null] as const) {
      expect(dashboardNavLabel({ gender }, en.dashboard)).toBe('Dashboard')
    }
  })
})