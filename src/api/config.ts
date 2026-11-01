import type { ApiMode } from './types'

/**
 * Connection configuration — config, not code.
 *
 * The mock adapter is the default for this MVP. Switching to the real Mentingo
 * backend is a configuration change (`VITE_API_ADAPTER=http` + `VITE_API_URL`),
 * never a screen rewrite. No live Mentingo backend is connected in Stage 0.
 */

export interface ApiConfig {
  mode: ApiMode
  baseUrl: string
  requestTimeoutMs: number
  mock: {
    scenario: 'seeded' | 'empty'
    session: 'teacher' | 'student' | 'none'
    latencyMs: number
  }
}

const DEFAULT_BASE_URL = 'http://localhost:3001/api/v1'
const DEFAULT_TIMEOUT_MS = 15_000
const DEFAULT_MOCK_LATENCY_MS = 60

function readMode(value: string | undefined): ApiMode {
  if (value === undefined || value === '' || value === 'mock') return 'mock'
  if (value === 'http') return 'http'
  throw new Error(
    `Invalid VITE_API_ADAPTER "${value}". Expected "mock" or "http".`,
  )
}

function readScenario(value: string | undefined): 'seeded' | 'empty' {
  if (value === undefined || value === '' || value === 'seeded') {
    return 'seeded'
  }
  if (value === 'empty') return 'empty'
  throw new Error(
    `Invalid VITE_MOCK_SCENARIO "${value}". Expected "seeded" or "empty".`,
  )
}

function readSession(value: string | undefined): 'teacher' | 'student' | 'none' {
  if (value === undefined || value === '' || value === 'teacher') {
    return 'teacher'
  }
  if (value === 'student' || value === 'none') return value
  throw new Error(
    `Invalid VITE_MOCK_SESSION "${value}". Expected "teacher", "student" or "none".`,
  )
}

function readPositiveInt(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function createApiConfig(env: ImportMetaEnv): ApiConfig {
  const mode = readMode(env.VITE_API_ADAPTER)
  return {
    mode,
    baseUrl: (env.VITE_API_URL || DEFAULT_BASE_URL).replace(/\/+$/, ''),
    requestTimeoutMs: readPositiveInt(
      env.VITE_API_TIMEOUT_MS,
      DEFAULT_TIMEOUT_MS,
    ),
    mock: {
      scenario: readScenario(env.VITE_MOCK_SCENARIO),
      session: readSession(env.VITE_MOCK_SESSION),
      latencyMs: DEFAULT_MOCK_LATENCY_MS,
    },
  }
}

export const apiConfig: ApiConfig = createApiConfig(import.meta.env)
