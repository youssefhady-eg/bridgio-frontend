import { describe, expect, it } from 'vitest'
import { isDemoData, showDevChrome } from './dev-chrome'

describe('dev chrome flag', () => {
  it('is visible by default and hidden only when set to "false"', () => {
    expect(showDevChrome({})).toBe(true)
    expect(showDevChrome({ VITE_SHOW_DEV_CHROME: 'true' })).toBe(true)
    expect(showDevChrome({ VITE_SHOW_DEV_CHROME: 'false' })).toBe(false)
  })

  it('flags demo data for the mock adapter only', () => {
    expect(isDemoData({})).toBe(true)
    expect(isDemoData({ VITE_API_ADAPTER: 'mock' })).toBe(true)
    expect(isDemoData({ VITE_API_ADAPTER: 'http' })).toBe(false)
  })
})
