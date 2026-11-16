import { useQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { sessionQueryOptions, searchQueryOptions } from '~/api/queries'
import type { SearchResultKind } from '~/api/types'
import { AppIcon, type AppIconName } from '~/components/AppIcon'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

const kindIcon: Record<SearchResultKind, AppIconName> = {
  test: 'tests',
  material: 'materials',
  question: 'questions',
}

/** The dropdown stays short; the full, shareable list lives on `/search`. */
const MAX_INLINE_RESULTS = 6

/**
 * Inline header search.
 *
 * Clicking the control opens a panel in place — it never navigates to
 * `/search`. Typing filters through the same PROPOSED `search.search` seam the
 * search page uses (the mock adapter's own seed, teacher-only), and choosing a
 * result navigates to it. A "view all results" link opens the dedicated
 * `/search?q=` page for the full list, so the URL-based search is kept without
 * forcing every search to leave the current screen.
 */
export function HeaderSearch() {
  const strings = useStrings()
  const copy = strings.search
  const lang = useLang()
  const role = usePreviewRole()
  const { pathname } = useRouterState({ select: (state) => state.location })

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const sessionQuery = useQuery(sessionQueryOptions())
  const teacherId =
    sessionQuery.data?.user.role === 'teacher'
      ? sessionQuery.data.user.id
      : null

  const normalized = query.trim()
  const resultsQuery = useQuery({
    ...searchQueryOptions(normalized),
    enabled: open && teacherId !== null && normalized.length > 0,
  })

  // The panel is a dropdown, not a page: any navigation closes it.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Focus the field as soon as the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Close on a click outside the control or Escape (returning focus to it).
  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        rootRef.current
          ?.querySelector<HTMLButtonElement>('.app-utility__button--search')
          ?.focus()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const results = resultsQuery.data?.results ?? []
  const visible = results.slice(0, MAX_INLINE_RESULTS)

  return (
    <div className="header-search" ref={rootRef}>
      <button
        type="button"
        className="app-utility__button app-utility__button--search"
        onClick={() => setOpen((current) => !current)}
        aria-label={strings.header.searchOpenLabel}
        aria-expanded={open}
        aria-controls="header-search-panel"
        title={strings.header.searchLabel}
      >
        <AppIcon name="search" size={20} />
        <span className="app-utility__label">{strings.header.searchLabel}</span>
      </button>

      {open ? (
        <div
          className="header-search__panel"
          id="header-search-panel"
          role="dialog"
          aria-label={copy.title}
        >
          <div className="header-search__field">
            <label className="field header-search__label">
              <span className="field__label">{copy.inputLabel}</span>
              <input
                ref={inputRef}
                className="input"
                type="search"
                value={query}
                placeholder={copy.placeholder}
                autoComplete="off"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button
              type="button"
              className="app-utility__button header-search__close"
              onClick={() => setOpen(false)}
              aria-label={strings.header.searchCloseLabel}
              title={strings.header.searchCloseLabel}
            >
              <AppIcon name="close" size={18} />
            </button>
          </div>

          {teacherId === null ? (
            <p className="header-search__note">{copy.roleBody}</p>
          ) : normalized.length === 0 ? (
            <p className="header-search__note">{copy.promptBody}</p>
          ) : resultsQuery.isPending ? (
            <p className="header-search__note" role="status">
              {copy.loading}
            </p>
          ) : resultsQuery.isError || !resultsQuery.data ? (
            <p
              className="header-search__note header-search__note--error"
              role="alert"
            >
              {copy.loadErrorBody}
            </p>
          ) : results.length === 0 ? (
            <p className="header-search__note">{copy.emptyBody(normalized)}</p>
          ) : (
            <>
              <ul className="search-results search-results--inline">
                {visible.map((result) => (
                  <li className="search-result" key={result.id}>
                    <span className="search-result__icon" aria-hidden="true">
                      <AppIcon name={kindIcon[result.kind]} size={20} />
                    </span>
                    <div className="search-result__main">
                      <span className="search-result__kind">
                        {copy.kinds[result.kind]}
                      </span>
                      <h3>{result.title}</h3>
                      <p className="search-result__context">{result.context}</p>
                    </div>
                    {result.testId ? (
                      <Link
                        to="/teacher/tests/$testId"
                        params={{ testId: result.testId }}
                        search={{ as: role, lang }}
                        className="button button--secondary button--small"
                        preload={false}
                        onClick={() => setOpen(false)}
                      >
                        {copy.open}
                      </Link>
                    ) : result.kind === 'material' ? (
                      <Link
                        to="/teacher/materials"
                        search={{ as: role, lang }}
                        className="button button--secondary button--small"
                        preload={false}
                        onClick={() => setOpen(false)}
                      >
                        {copy.open}
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
              <div className="header-search__foot">
                <Link
                  to="/search"
                  search={{ as: role, lang, q: normalized }}
                  className="screen-link"
                  preload={false}
                  onClick={() => setOpen(false)}
                >
                  {copy.viewAll}
                </Link>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
