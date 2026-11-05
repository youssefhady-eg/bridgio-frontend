import { describe, expect, it } from 'vitest'
import { wrapFocusIndex } from './useFocusScope'

describe('wrapFocusIndex', () => {
  it('moves forward and wraps to the first item', () => {
    expect(wrapFocusIndex(0, 3, false)).toBe(1)
    expect(wrapFocusIndex(2, 3, false)).toBe(0)
  })

  it('moves backward and wraps to the last item', () => {
    expect(wrapFocusIndex(1, 3, true)).toBe(0)
    expect(wrapFocusIndex(0, 3, true)).toBe(2)
  })

  it('enters the scope from outside at the matching end', () => {
    expect(wrapFocusIndex(-1, 3, false)).toBe(0)
    expect(wrapFocusIndex(-1, 3, true)).toBe(2)
  })

  it('has nowhere to go with no focusable items', () => {
    expect(wrapFocusIndex(0, 0, false)).toBe(-1)
  })
})
