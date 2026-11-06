import { describe, expect, it } from 'vitest'
import { otherTheme, parseTheme, themeInitScript, THEME_STORAGE_KEY } from './theme'

describe('theme', () => {
  it('parses only light and dark', () => {
    expect(parseTheme('dark')).toBe('dark')
    expect(parseTheme('light')).toBe('light')
    expect(parseTheme('system')).toBeUndefined()
    expect(parseTheme(null)).toBeUndefined()
    expect(parseTheme('')).toBeUndefined()
  })

  it('toggles between the two themes', () => {
    expect(otherTheme('light')).toBe('dark')
    expect(otherTheme('dark')).toBe('light')
  })

  it('the init script reads the storage key and guards against failure', () => {
    expect(themeInitScript).toContain(THEME_STORAGE_KEY)
    expect(themeInitScript).toContain('try')
    expect(themeInitScript).toContain('catch')
    // Only the two known values are ever applied.
    expect(themeInitScript).toContain("t==='dark'||t==='light'")
  })
})
