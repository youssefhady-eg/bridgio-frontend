import { describe, expect, it } from 'vitest'
import type { BridgioApi } from '../contract'
import { ApiError } from '../errors'
import { createMockApi } from '../mock/mock-adapter'
import { createHttpApi } from './http-adapter'

const BASE_URL = 'https://api.example.test/api/v1'

type Call = { url: string; init: RequestInit | undefined }

function fakeFetch(handler?: (call: Call) => Response): {
  fetchImpl: typeof fetch
  calls: Call[]
} {
  const calls: Call[] = []
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const call = {
      url: input instanceof Request ? input.url : String(input),
      init,
    }
    calls.push(call)
    if (handler) return handler(call)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }) as typeof fetch
  return { fetchImpl, calls }
}

function methodPaths(api: BridgioApi): string[] {
  const paths: string[] = []
  for (const [namespace, value] of Object.entries(api)) {
    if (typeof value !== 'object' || value === null) continue
    for (const [name, member] of Object.entries(value)) {
      if (typeof member === 'function') paths.push(`${namespace}.${name}`)
    }
  }
  return paths.sort()
}

describe('http adapter — interface parity', () => {
  it('implements the same method names as the mock adapter', () => {
    const { fetchImpl } = fakeFetch()
    const http = createHttpApi({
      baseUrl: BASE_URL,
      requestTimeoutMs: 1_000,
      fetchImpl,
    })
    const mock = createMockApi({ latencyMs: 0 })
    expect(methodPaths(http)).toEqual(methodPaths(mock))
    expect(http.mode).toBe('http')
  })
})

describe('http adapter — request construction', () => {
  it('builds the PROPOSED path, attaches the optional bearer token and parses JSON', async () => {
    const { fetchImpl, calls } = fakeFetch(() =>
      new Response(JSON.stringify({ teacher: { id: 't1' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    const http = createHttpApi({
      baseUrl: BASE_URL,
      requestTimeoutMs: 1_000,
      getAccessToken: () => 'demo-token',
      fetchImpl,
    })

    const result = await http.teachers.getDashboard({ teacherId: 't1' })
    expect(result).toEqual({ teacher: { id: 't1' } })
    expect(calls).toHaveLength(1)
    expect(calls[0]?.url).toBe(`${BASE_URL}/teachers/t1/dashboard`)
    expect(calls[0]?.init?.method).toBe('GET')
    expect(
      (calls[0]?.init?.headers as Record<string, string>).Authorization,
    ).toBe('Bearer demo-token')
  })

  it('serialises query parameters and JSON bodies', async () => {
    const { fetchImpl, calls } = fakeFetch(() =>
      new Response(JSON.stringify({ id: 'test_1' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    const http = createHttpApi({
      baseUrl: BASE_URL,
      requestTimeoutMs: 1_000,
      fetchImpl,
    })

    await http.students.getProgress({
      studentId: 's1',
      classroomId: 'c1',
    })
    expect(calls[0]?.url).toBe(
      `${BASE_URL}/students/s1/progress?classroomId=c1`,
    )

    await http.tests.createDraft({
      teacherId: 't1',
      classroomId: 'c1',
      title: 'اختبار',
      description: null,
      source: { kind: 'curriculum_unit', unitId: 'u1' },
    })
    expect(calls[1]?.init?.method).toBe('POST')
    expect(JSON.parse(String(calls[1]?.init?.body))).toMatchObject({
      teacherId: 't1',
      classroomId: 'c1',
      source: { kind: 'curriculum_unit', unitId: 'u1' },
    })
  })

  it('returns undefined for 204 responses', async () => {
    const { fetchImpl } = fakeFetch(() => new Response(null, { status: 204 }))
    const http = createHttpApi({
      baseUrl: BASE_URL,
      requestTimeoutMs: 1_000,
      fetchImpl,
    })
    await expect(http.auth.signOut()).resolves.toBeUndefined()
  })
})

describe('http adapter — errors', () => {
  it('maps backend errors to ApiError with the shared code', async () => {
    const { fetchImpl } = fakeFetch(() =>
      new Response(
        JSON.stringify({ code: 'NOT_FOUND', message: 'Test not found.' }),
        {
          status: 404,
          headers: { 'content-type': 'application/json' },
        },
      ),
    )
    const http = createHttpApi({
      baseUrl: BASE_URL,
      requestTimeoutMs: 1_000,
      fetchImpl,
    })

    const error = await http.tests.get({ testId: 'missing' }).catch((value) => value)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      code: 'NOT_FOUND',
      status: 404,
      message: 'Test not found.',
    })
  })

  it('maps a network failure to ApiError NETWORK', async () => {
    const fetchImpl = (async () => {
      throw new TypeError('offline')
    }) as typeof fetch
    const http = createHttpApi({
      baseUrl: BASE_URL,
      requestTimeoutMs: 1_000,
      fetchImpl,
    })

    const error = await http.auth.getSession().catch((value) => value)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: 'NETWORK' })
  })
})
