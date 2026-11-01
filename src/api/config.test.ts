import { describe, expect, it } from 'vitest'
import { createApiConfig } from './config'

function env(values: Record<string, string>): ImportMetaEnv {
  return values as unknown as ImportMetaEnv
}

describe('API config', () => {
  it('defaults to the mock adapter, seeded demo data and a teacher session', () => {
    const config = createApiConfig(env({}))
    expect(config.mode).toBe('mock')
    expect(config.baseUrl).toBe('http://localhost:3001/api/v1')
    expect(config.mock.scenario).toBe('seeded')
    expect(config.mock.session).toBe('teacher')
    expect(config.requestTimeoutMs).toBe(15_000)
  })

  it('switches to HTTP by configuration only and normalises the URL', () => {
    const config = createApiConfig(
      env({
        VITE_API_ADAPTER: 'http',
        VITE_API_URL: 'https://mentingo.example.test/api/v1///',
        VITE_API_TIMEOUT_MS: '9000',
      }),
    )
    expect(config.mode).toBe('http')
    expect(config.baseUrl).toBe('https://mentingo.example.test/api/v1')
    expect(config.requestTimeoutMs).toBe(9_000)
  })

  it('rejects an unknown adapter mode instead of silently falling back', () => {
    expect(() => createApiConfig(env({ VITE_API_ADAPTER: 'mentingo' }))).toThrow(
      /VITE_API_ADAPTER/,
    )
  })

  it('supports the empty mock scenario and a student session', () => {
    const config = createApiConfig(
      env({
        VITE_MOCK_SCENARIO: 'empty',
        VITE_MOCK_SESSION: 'student',
      }),
    )
    expect(config.mock.scenario).toBe('empty')
    expect(config.mock.session).toBe('student')
  })
})
