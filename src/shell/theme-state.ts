/**
 * Persisted colour theme (a per-visitor convenience).
 *
 * Light is the default. The dark theme is opt-in: only the exact stored value
 * "dark" turns it on, so a missing, empty or unknown value stays light and a
 * corrupt entry can never strand a visitor on a surprise theme.
 */
export const THEME_STORAGE_KEY = 'bridgio-theme'

export type Theme = 'light' | 'dark'

export function parseTheme(value: unknown): Theme {
  return value === 'dark' ? 'dark' : 'light'
}

export function serializeTheme(theme: Theme): string {
  return theme
}
