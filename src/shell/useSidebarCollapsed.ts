import { useCallback, useEffect, useState } from 'react'
import {
  parseCollapsed,
  serializeCollapsed,
  SIDEBAR_STORAGE_KEY,
} from './sidebar-state'

/**
 * Fold state of the desktop sidebar. The server and first client render are
 * always expanded (so hydration matches); the stored choice is applied after
 * mount. Storage can be unavailable, so every access is guarded.
 */
export function useSidebarCollapsed(): {
  collapsed: boolean
  toggle: () => void
} {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      setCollapsed(parseCollapsed(window.localStorage.getItem(SIDEBAR_STORAGE_KEY)))
    } catch {
      // Keep the default (expanded).
    }
  }, [])

  const toggle = useCallback(() => {
    setCollapsed((current) => {
      const next = !current
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, serializeCollapsed(next))
      } catch {
        // The choice still applies for this visit.
      }
      return next
    })
  }, [])

  return { collapsed, toggle }
}
