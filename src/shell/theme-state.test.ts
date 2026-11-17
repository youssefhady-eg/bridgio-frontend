import { describe, expect, it, vi } from 'vitest'
import {
  getTheme,
  parseTheme,
  resolveTheme,
  serializeTheme,
  setTheme,
  subscribeTheme,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  toggleTheme,
} from './theme-state'

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

  it('uses the documented storage key and attribute', () => {
    expect(THEME_STORAGE_KEY).toBe('bridgio-theme')
    expect(THEME_ATTRIBUTE).toBe('data-theme')
  })
})

describe('theme resolution on a fresh document', () => {
  it('lets a valid stored choice win over the pre-painted attribute', () => {
    expect(resolveTheme('dark', 'light')).toBe('dark')
    expect(resolveTheme('light', 'dark')).toBe('light')
  })

  it('falls back to the pre-paint attribute when storage is empty', () => {
    expect(resolveTheme(null, 'dark')).toBe('dark')
    expect(resolveTheme('', 'dark')).toBe('dark')
    expect(resolveTheme(undefined, 'dark')).toBe('dark')
    expect(resolveTheme(null, 'light')).toBe('light')
  })

  it('falls back to light when neither source carries a valid value', () => {
    expect(resolveTheme(null, null)).toBe('light')
    expect(resolveTheme('dark ', 'unexpected')).toBe('light')
  })

  it('resolves a stored dark theme the same way on every document load', () => {
    // This is the language-switch contract: the resolver reads only the stored
    // value and the pre-painted attribute, never the active language, so an
    // EN -> AR navigation repaints the theme the visitor left.
    expect(resolveTheme('dark', 'dark')).toBe('dark')
  })
})

describe('shared theme store', () => {
  it('keeps one value and toggles it in memory without a DOM', () => {
    setTheme('light')
    expect(getTheme()).toBe('light')
    toggleTheme()
    expect(getTheme()).toBe('dark')
    toggleTheme()
    expect(getTheme()).toBe('light')
  })

  it('notifies every subscriber and stops after unsubscribe', () => {
    const first = vi.fn()
    const second = vi.fn()
    const offFirst = subscribeTheme(first)
    const offSecond = subscribeTheme(second)

    setTheme('dark')
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(1)

    offFirst()
    setTheme('light')
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(2)

    offSecond()
    setTheme('dark')
    expect(second).toHaveBeenCalledTimes(2)
  })
})