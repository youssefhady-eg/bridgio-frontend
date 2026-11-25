/**
 * Persisted colour theme (a per-visitor convenience).
 *
 * Light is the default. The dark theme is opt-in: only the exact stored value
 * "dark" turns it on, so a missing, empty or unknown value stays light and a
 * corrupt entry can never strand a visitor on a surprise theme.
 *
 * The theme is one document-wide setting, so it lives in a single external
 * store rather than in each component's `useState`. Two independent copies (the
 * account menu and the Interface settings page) would drift: the menu could
 * toggle the theme while the settings button still reported the old one.
 */
export const THEME_STORAGE_KEY = 'bridgio-theme'

/** The attribute the pre-paint script sets on `<html>` (see `__root.tsx`). */
export const THEME_ATTRIBUTE = 'data-theme'

export type Theme = 'light' | 'dark'

export function parseTheme(value: unknown): Theme {
  return value === 'dark' ? 'dark' : 'light'
}

export function serializeTheme(theme: Theme): string {
  return theme
}

/**
 * Resolve the theme a document should paint.
 *
 * A valid stored choice always wins, so every full page load - including the
 * language switch, which is a normal navigation - paints the same theme. When
 * storage is empty or unavailable, the value the pre-paint script already put
 * on `<html>` is authoritative; light is the last resort. The active language
 * is deliberately not an input: switching language must never change the theme.
 */
export function resolveTheme(stored: unknown, prePainted: unknown): Theme {
  if (stored === 'light' || stored === 'dark') return stored
  return parseTheme(prePainted)
}

let currentTheme: Theme | null = null
let storageListenerAdded = false
const listeners = new Set<() => void>()

function readStoredTheme(): unknown {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    return null
  }
}

function readPrePaintedTheme(): unknown {
  if (typeof document === 'undefined') return null
  return document.documentElement.getAttribute(THEME_ATTRIBUTE)
}

function paintTheme(theme: Theme): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)
  }
}

function emit(): void {
  for (const listener of listeners) listener()
}

/** The current theme. Stable between changes, so it is safe as a store snapshot. */
export function getTheme(): Theme {
  if (currentTheme === null) {
    currentTheme = resolveTheme(readStoredTheme(), readPrePaintedTheme())
  }
  return currentTheme
}

/** Subscribe to theme changes (the `useSyncExternalStore` contract). */
export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener)
  if (!storageListenerAdded) {
    storageListenerAdded = true
    if (typeof window !== 'undefined') {
      // Another tab changed the choice: adopt it here too.
      window.addEventListener('storage', (event) => {
        if (event.key !== THEME_STORAGE_KEY && event.key !== null) return
        currentTheme = resolveTheme(readStoredTheme(), readPrePaintedTheme())
        paintTheme(currentTheme)
        emit()
      })
    }
  }
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Apply a theme everywhere: `<html>`, storage and every subscriber. The write
 * is guarded because storage can be unavailable (private mode); the choice
 * still applies for the visit, it just does not survive a reload.
 */
export function setTheme(theme: Theme): void {
  currentTheme = theme
  paintTheme(theme)
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, serializeTheme(theme))
    }
  } catch {
    // The choice still applies for this visit.
  }
  emit()
}

export function toggleTheme(): void {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark')
}

/** Keep `<html>` in step with the store after hydration. */
export function syncThemeAttribute(): void {
  paintTheme(getTheme())
}