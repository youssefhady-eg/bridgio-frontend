import { ApiError, type ApiErrorCode } from '../errors'

/**
 * The ONLY place in the frontend that calls `fetch`.
 * Screens and components must go through the adapter in `src/api/`.
 */

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface HttpRequestOptions {
  method: HttpMethod
  path: string
  query?: Record<string, string | undefined>
  body?: unknown
  signal?: AbortSignal
}

export interface HttpClientOptions {
  baseUrl: string
  timeoutMs: number
  /**
   * PROPOSED auth transport. Mentingo's real auth method is UNCONFIRMED; if it
   * uses a bearer token, this is the single place it is attached. If it uses a
   * cookie session, remove this hook and set credentials in one place. Never
   * store the token in UI state.
   */
  getAccessToken?: () => string | null
  fetchImpl?: typeof fetch
}

const API_ERROR_CODES: ReadonlySet<string> = new Set<ApiErrorCode>([
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VALIDATION',
  'CONFLICT',
  'UNSUPPORTED',
  'NETWORK',
  'TIMEOUT',
  'INTERNAL',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readApiErrorCode(value: unknown): ApiErrorCode | null {
  if (isRecord(value) && typeof value.code === 'string' && API_ERROR_CODES.has(value.code)) {
    return value.code as ApiErrorCode
  }
  return null
}

function mapStatus(status: number): ApiErrorCode {
  if (status === 400 || status === 422) return 'VALIDATION'
  if (status === 401) return 'UNAUTHENTICATED'
  if (status === 403) return 'FORBIDDEN'
  if (status === 404) return 'NOT_FOUND'
  if (status === 408) return 'TIMEOUT'
  if (status === 409) return 'CONFLICT'
  if (status === 501) return 'UNSUPPORTED'
  return 'INTERNAL'
}

export class HttpClient {
  private readonly baseUrl: string
  private readonly timeoutMs: number
  private readonly getAccessToken?: () => string | null
  private readonly fetchImpl: typeof fetch

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '')
    this.timeoutMs = options.timeoutMs
    this.getAccessToken = options.getAccessToken
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis)
  }

  async request<T>(options: HttpRequestOptions): Promise<T> {
    const controller = new AbortController()
    let timedOut = false
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, this.timeoutMs)

    const abortFromCaller = (): void => controller.abort()
    options.signal?.addEventListener('abort', abortFromCaller, { once: true })

    try {
      const headers: Record<string, string> = { Accept: 'application/json' }
      if (options.body !== undefined) {
        headers['Content-Type'] = 'application/json'
      }
      const token = this.getAccessToken?.() ?? null
      if (token) headers.Authorization = `Bearer ${token}`

      let response: Response
      try {
        response = await this.fetchImpl(this.buildUrl(options), {
          method: options.method,
          headers,
          body:
            options.body === undefined
              ? undefined
              : JSON.stringify(options.body),
          signal: controller.signal,
        })
      } catch (error) {
        if (timedOut) {
          throw new ApiError('TIMEOUT', 'The request timed out.', {
            cause: error,
          })
        }
        if (options.signal?.aborted) {
          throw new ApiError('NETWORK', 'The request was cancelled.', {
            cause: error,
          })
        }
        throw new ApiError('NETWORK', 'The API could not be reached.', {
          cause: error,
        })
      }

      const text = await response.text()
      let payload: unknown = null
      if (text.length > 0) {
        try {
          payload = JSON.parse(text) as unknown
        } catch (error) {
          if (response.ok) {
            throw new ApiError('INTERNAL', 'The API returned invalid JSON.', {
              status: response.status,
              cause: error,
            })
          }
          payload = null
        }
      }

      if (!response.ok) {
        const message =
          isRecord(payload) && typeof payload.message === 'string'
            ? payload.message
            : `The API request failed with status ${response.status}.`
        throw new ApiError(
          readApiErrorCode(payload) ?? mapStatus(response.status),
          message,
          { status: response.status, details: payload },
        )
      }

      if (response.status === 204 || payload === null) {
        return undefined as T
      }
      return payload as T
    } finally {
      clearTimeout(timer)
      options.signal?.removeEventListener('abort', abortFromCaller)
    }
  }

  private buildUrl(options: HttpRequestOptions): string {
    const url = new URL(`${this.baseUrl}${options.path}`)
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined && value !== '') url.searchParams.set(key, value)
    }
    return url.toString()
  }
}
