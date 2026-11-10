import { describe, expect, it } from 'vitest'
import { parseTheme, serializeTheme, THEME_STORAGE_KEY } from './theme-state'

describe('theme state', () => {
  it('is light unless the stored value is exactly "dark"', () => {
    expect(parseTheme('dark')).toBe('dark')
    expect(parseTheme('light')).toBe('light')
    expect(parseTheme(null)).toBe('light')
    expect(parseTheme(undefined)).toBe('light')
    expect(parseTheme('')).toBe('light')
    expect(parseTheme('DARK')).toBe('light')
    expect(parseTheme('dark ')).toBe('light')
  })

  it('round-trips through storage', () => {
    expect(serializeTheme('dark')).toBe('dark')
    expect(serializeTheme('light')).toBe('light')
    expect(parseTheme(serializeTheme('dark'))).toBe('dark')
    expect(parseTheme(serializeTheme('light'))).toBe('light')
  })

  it('uses the documented storage key', () => {
    expect(THEME_STORAGE_KEY).toBe('bridgio-theme')
  })
})
