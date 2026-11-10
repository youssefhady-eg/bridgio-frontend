import { useCallback, useEffect, useState } from 'react'
import {
  parseTheme,
  serializeTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from './theme-state'

/**
 * Colour theme state for the header toggle.
 *
 * The server and the first client render are always light (so hydration
 * matches). The stored choice is applied after mount; a tiny inline script in
 * `ShellDocument` also sets `data-theme` before first paint so there is no
 * flash. Storage can be unavailable, so every access is guarded.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    } catch {
      stored = null
    }
    const parsed = parseTheme(stored)
    setTheme(parsed)
    document.documentElement.dataset.theme = parsed
  }, [])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, serializeTheme(next))
      } catch {
        // The choice still applies for this visit.
      }
      document.documentElement.dataset.theme = next
      return next
    })
  }, [])

  return { theme, toggle }
}
