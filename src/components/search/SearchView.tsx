import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'
import { sessionQueryOptions, searchQueryOptions } from '~/api/queries'
import type { SearchResultKind } from '~/api/types'
import { AppIcon, type AppIconName } from '~/components/AppIcon'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { formatCount } from '~/components/dashboard/format'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

const kindIcon: Record<SearchResultKind, AppIconName> = {
  test: 'tests',
  material: 'materials',
  question: 'questions',
}

/**
 * Global in-app search — teacher-only in Batch 5.
 *
 * The query lives in the URL (`/search?q=`), so a result page can be shared and
 * the browser back button works. Results come from `search.search` (PROPOSED,
 * new in Batch 5), which filters the existing seed over the caller's own tests,
 * materials and questions; nothing is indexed or invented in the component.
 * Tests and questions open their test screen; a material opens the material
 * library, the only material screen that exists.
 */
export function SearchView({ query }: { query: string }) {
  const strings = useStrings()
  const copy = strings.search
  const lang = useLang()
  const role = usePreviewRole()
  const navigate = useNavigate()

  const [draft, setDraft] = useState(query)
  useEffect(() => {
    setDraft(query)
  }, [query])

  const sessionQuery = useQuery(sessionQueryOptions())
  const teacherId =
    sessionQuery.data?.user.role === 'teacher'
      ? sessionQuery.data.user.id
      : null

  const normalizedQuery = query.trim()
  const resultsQuery = useQuery({
    ...searchQueryOptions(normalizedQuery),
    enabled: teacherId !== null && normalizedQuery.length > 0,
  })

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void navigate({
      to: '/search',
      search: { as: role, lang, q: draft.trim() },
    })
  }

  if (sessionQuery.isPending) {
    return (
      <Frame>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (sessionQuery.isError) {
    return (
      <Frame>
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  if (teacherId === null) {
    return (
      <Frame>
        <EmptyNote
          icon="search"
          title={copy.roleTitle}
          body={copy.roleBody}
        />
      </Frame>
    )
  }

  return (
    <Frame>
      <form className="search-form" role="search" onSubmit={submit}>
        <label className="field">
          <span className="field__label">{copy.inputLabel}</span>
          <input
            className="input"
            type="search"
            value={draft}
            placeholder={copy.placeholder}
            onChange={(event) => setDraft(event.target.value)}
            autoComplete="off"
          />
        </label>
        <button
          type="submit"
          className="button button--primary"
          disabled={draft.trim().length === 0}
        >
          {copy.submit}
        </button>
      </form>

      {normalizedQuery.length === 0 ? (
        <EmptyNote
          icon="search"
          title={copy.promptTitle}
          body={copy.promptBody}
        />
      ) : resultsQuery.isPending ? (
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      ) : resultsQuery.isError || !resultsQuery.data ? (
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      ) : resultsQuery.data.results.length === 0 ? (
        <EmptyNote
          icon="search"
          title={copy.emptyTitle}
          body={copy.emptyBody(normalizedQuery)}
        />
      ) : (
        <section className="dashboard__section" aria-labelledby="search-heading">
          <div className="section-head">
            <h2 id="search-heading">{copy.resultsLabel}</h2>
            <span className="count-chip">
              {formatCount(resultsQuery.data.results.length, lang)}
            </span>
          </div>
          <ul className="search-results">
            {resultsQuery.data.results.map((result) => (
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
                  >
                    {copy.open}
                  </Link>
                ) : result.kind === 'material' ? (
                  <Link
                    to="/teacher/materials"
                    search={{ as: role, lang }}
                    className="button button--secondary button--small"
                    preload={false}
                  >
                    {copy.open}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}
    </Frame>
  )
}

function Frame({ children }: { children: React.ReactNode }) {
  const copy = useStrings().search
  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />
      {children}
    </div>
  )
}
