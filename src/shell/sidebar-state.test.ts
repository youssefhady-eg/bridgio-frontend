import { describe, expect, it } from 'vitest'
import { parseCollapsed, serializeCollapsed } from './sidebar-state'

describe('sidebar fold state', () => {
  it('only the exact value "collapsed" folds the sidebar', () => {
    expect(parseCollapsed('collapsed')).toBe(true)
    expect(parseCollapsed('expanded')).toBe(false)
    expect(parseCollapsed(null)).toBe(false)
    expect(parseCollapsed('true')).toBe(false)
  })

  it('round-trips', () => {
    expect(parseCollapsed(serializeCollapsed(true))).toBe(true)
    expect(parseCollapsed(serializeCollapsed(false))).toBe(false)
  })
})
