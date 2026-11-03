import { useRouterState } from '@tanstack/react-router'
import { ar, en, type Strings } from '~/content/strings'
import { defaultLang, parseLang, type Lang } from './lang'

/**
 * Active UI language for the shell (`?lang=ar|en`).
 *
 * Read from the router location so it works in every route, including the
 * notFound/error states, exactly like the preview role hook. Defaults to Arabic
 * when the param is absent (server render and first paint both see Arabic).
 */
export function useLang(): Lang {
  const { pathname, href } = useRouterState({
    select: (state) => state.location,
  })
  const searchStr = href.slice(pathname.length).split('#')[0] ?? ''
  return (
    parseLang(new URLSearchParams(searchStr).get('lang')) ?? defaultLang
  )
}

/**
 * Centralised strings for the active language. Every component reads copy from
 * here (never a hard-coded literal) so a single language change swaps the whole
 * UI and BRIDGIO / Mohsen stay swappable from one place.
 */
export function useStrings(): Strings {
  return stringsFor(useLang())
}

/**
 * Non-hook variant for framework callbacks that run outside React (route
 * `head` functions), so the server-rendered title already matches `?lang`.
 * Unknown values fall back to Arabic, the product default.
 */
export function stringsFor(lang: unknown): Strings {
  return parseLang(lang) === 'en' ? en : ar
}
