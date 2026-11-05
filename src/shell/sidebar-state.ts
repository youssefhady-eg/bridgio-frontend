/** Persisted fold state of the desktop sidebar (a per-visitor convenience). */
export const SIDEBAR_STORAGE_KEY = 'bridgio-sidebar'

/** Only the exact stored value "collapsed" folds the sidebar; anything else is expanded. */
export function parseCollapsed(value: unknown): boolean {
  return value === 'collapsed'
}

export function serializeCollapsed(collapsed: boolean): string {
  return collapsed ? 'collapsed' : 'expanded'
}
