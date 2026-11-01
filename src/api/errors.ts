/**
 * Single error shape for both adapters. Screens must handle `ApiError`, never
 * transport-specific errors from `fetch`.
 */

export type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'UNSUPPORTED'
  | 'NETWORK'
  | 'TIMEOUT'
  | 'INTERNAL'

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status: number | null
  readonly details: unknown

  constructor(
    code: ApiErrorCode,
    message: string,
    options: { status?: number | null; details?: unknown; cause?: unknown } = {},
  ) {
    super(message, { cause: options.cause })
    this.name = 'ApiError'
    this.code = code
    this.status = options.status ?? null
    this.details = options.details ?? null
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError
}
