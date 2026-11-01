import { apiConfig, type ApiConfig } from './config'
import type { BridgioApi } from './contract'
import { createHttpApi } from './http/http-adapter'
import { createMockApi } from './mock/mock-adapter'

/**
 * The single API client factory. Screens import `api` from here (or through
 * `src/api/queries.ts`) and never import the mock or HTTP adapter directly.
 */
export interface CreateApiClientOptions {
  getAccessToken?: () => string | null
  fetchImpl?: typeof fetch
}

export function createApiClient(
  config: ApiConfig = apiConfig,
  options: CreateApiClientOptions = {},
): BridgioApi {
  if (config.mode === 'http') {
    return createHttpApi({
      baseUrl: config.baseUrl,
      requestTimeoutMs: config.requestTimeoutMs,
      getAccessToken: options.getAccessToken,
      fetchImpl: options.fetchImpl,
    })
  }

  return createMockApi({
    scenario: config.mock.scenario,
    session: config.mock.session,
    latencyMs: config.mock.latencyMs,
  })
}

/**
 * App-wide singleton. The mock is the default for this MVP; switching to the
 * real backend is config only (`VITE_API_ADAPTER=http`, `VITE_API_URL`).
 */
export const api: BridgioApi = createApiClient()

export type { BridgioApi } from './contract'
export type { ApiConfig } from './config'
export { apiConfig, createApiConfig } from './config'
export { ApiError, isApiError, type ApiErrorCode } from './errors'
export { queryKeys } from './query-keys'
export * from './types'
