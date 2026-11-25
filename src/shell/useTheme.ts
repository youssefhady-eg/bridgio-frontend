import { useEffect, useSyncExternalStore } from 'react'
import {
  getTheme,
  subscribeTheme,
  syncThemeAttribute,
  toggleTheme,
  type Theme,
} from './theme-state'

/**
 * Colour theme for every control that reads or changes it.
 *
 * The state lives in a module-level store, so two mounts (the account menu and
 * the Interface settings page) see the same value and a toggle in one updates
 * the other immediately.
 *
 * The server and the hydration render are always light (the server cannot read
 * localStorage). A tiny inline script in `ShellDocument` sets `data-theme`
 * before first paint; after hydration the store takes over. Because the stored
 * choice is re-resolved on every document load, a full navigation - such as the
 * language switch - paints the same theme it left.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, (): Theme => 'light')

  useEffect(() => {
    // The pre-paint script normally set this already; keep the attribute in
    // step with the store for a storage-less first visit.
    syncThemeAttribute()
  }, [])

  return { theme, toggle: toggleTheme }
}