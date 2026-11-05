/**
 * Light / dark theme choice.
 *
 * Light is the default and the brand's reference theme. The dark theme is an
 * opt-in, user-chosen preference stored in localStorage and applied as
 * `data-theme` on <html> before first paint (see `themeInitScript`), so a
 * returning dark-mode visitor never sees a light flash. The dark colours are
 * PROPOSED tokens (tokens.css) pending brand approval.
 */

export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'bridgio-theme'

export function parseTheme(value: unknown): Theme | undefined {
  return value === 'light' || value === 'dark' ? value : undefined
}

export function otherTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark'
}

/**
 * Runs inline in <head>, before React. Kept tiny and defensive: storage can be
 * unavailable, and a bad stored value must fall back to light.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`
