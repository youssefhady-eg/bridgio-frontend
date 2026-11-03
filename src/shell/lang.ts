/**
 * Refinement branch — AR/EN locale primitives.
 *
 * The active language is UI state, carried in the root search param `?lang`
 * (SSR-correct: the server renders the requested direction) and mirrored to
 * localStorage for persistence on the next visit. This is NOT an auth or user
 * model: it only chooses which centralised string set and which text direction
 * the shell renders.
 */

export type Lang = 'ar' | 'en'

export const langs: readonly Lang[] = ['ar', 'en'] as const

/** Arabic is the product default; English is a mirror kept in sync by string. */
export const defaultLang: Lang = 'ar'

/** Safe parse of the `?lang` search param. */
export function parseLang(value: unknown): Lang | undefined {
  return value === 'ar' || value === 'en' ? value : undefined
}

/** Writing direction for a language: Arabic is RTL, English is LTR. */
export function dirFor(lang: Lang): 'rtl' | 'ltr' {
  return lang === 'en' ? 'ltr' : 'rtl'
}

/**
 * href for the language switch that preserves the current path and the other
 * search params (including the preview role), so toggling language never drops
 * the page the user is on.
 */
export function hrefWithLang(
  pathname: string,
  search: string,
  lang: Lang,
): string {
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search,
  )
  params.set('lang', lang)
  const qs = params.toString()
  return qs ? `${pathname}?${qs}` : pathname
}
