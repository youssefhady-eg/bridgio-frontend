import type { TestId } from './common'

/**
 * Global in-app search — PROPOSED, mock only.
 *
 * There is no search backend today. This shape is a proposal for Mentingo to
 * implement on restore/rebuild; the mock adapter filters the EXISTING seed
 * (the signed-in user's tests, materials and questions), so no new content is
 * invented and nothing outside the caller's visibility is returned.
 *
 * TEACHER-ONLY today: the three result kinds (tests, materials, questions) all
 * carry teacher authoring data. A non-teacher role receives an empty result set
 * in the mock rather than a partial, misleading index.
 */
export type SearchResultKind = 'test' | 'material' | 'question'

export interface SearchResult {
  id: string
  kind: SearchResultKind
  /** The matched text: a test/material title or a question prompt. */
  title: string
  /** Backend-supplied context line (class name, source, parent test). */
  context: string
  /** Test this result opens, when the result belongs to one. */
  testId: TestId | null
}

export interface SearchInput {
  query: string
  /** Optional cap on returned rows. */
  limit?: number
}

export interface SearchResults {
  /** Echo of the query the backend searched for (trimmed). */
  query: string
  results: SearchResult[]
}
