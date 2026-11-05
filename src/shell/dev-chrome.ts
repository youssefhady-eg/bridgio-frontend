/**
 * Developer chrome is the build-status furniture that helps the team and
 * reviewers but means nothing to a teacher or student: the stage banner, the
 * working-names note, the English build note and the preview-role switcher.
 *
 * It stays visible by default so the hosted review build keeps working as it
 * does today. Set `VITE_SHOW_DEV_CHROME=false` to hide it (for a user-facing
 * build). The role switcher is diagnostic UI state, not auth, so hiding it
 * removes no access control; `?as=` still works when typed into the URL.
 */
export function showDevChrome(
  env: { readonly VITE_SHOW_DEV_CHROME?: string } = import.meta.env,
): boolean {
  return env.VITE_SHOW_DEV_CHROME !== 'false'
}

/** True while the app is running on mock data (anything but the http adapter). */
export function isDemoData(
  env: { readonly VITE_API_ADAPTER?: string } = import.meta.env,
): boolean {
  return env.VITE_API_ADAPTER !== 'http'
}
