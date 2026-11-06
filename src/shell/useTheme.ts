import { useCallback, useEffect, useState } from 'react'
import { otherTheme, parseTheme, THEME_STORAGE_KEY, type Theme } from './theme'

/**
 * Current theme and a toggle. The server (and the first client render) always
 * assume light so hydration matches; the effect then reads what the init
 * script already applied to <html>.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    setTheme(parseTheme(document.documentElement.dataset.theme) ?? 'light')
  }, [])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = otherTheme(current)
      document.documentElement.dataset.theme = next
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
        // Storage can be unavailable; the choice still applies for this visit.
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
