import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { handleApiRequest } from './api'
import { createApiRequestHandler } from './observability'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const parseLog = (value: unknown): Record<string, unknown> => {
  const parsed: unknown = JSON.parse(String(value))
  if (!isRecord(parsed)) throw new TypeError('Expected an object log')
  return parsed
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('handleApiRequest', () => {
  it('returns health information with a matching structured request log', async () => {
    const log = vi.spyOn(console, 'info').mockImplementation(() => {})
    const response = await handleApiRequest(new Request('http://localhost/api/health'))
    expect(response?.status).toBe(200)
    await expect(response?.json()).resolves.toEqual({ status: 'ok', service: 'vue-vite-ssr' })
    expect(log).toHaveBeenCalledOnce()

    const record = parseLog(log.mock.calls[0]?.[0])
    expect(record).toEqual(
      expect.objectContaining({
        level: 'info',
        event: 'api.request',
        method: 'GET',
        endpoint: '/api/health',
        status: 200,
        outcome: 'success',
        durationMs: expect.any(Number),
        requestId: expect.any(String),
      }),
    )
    expect(response?.headers.get('x-request-id')).toBe(record.requestId)
  })

  it('ignores non-api requests without logging', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    await expect(handleApiRequest(new Request('http://localhost/'))).resolves.toBeNull()
    expect(info).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })

  it('logs unknown API routes as handled errors', async () => {
    const log = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const response = await handleApiRequest(new Request('http://localhost/api/missing'))
    expect(response?.status).toBe(404)
    expect(log).toHaveBeenCalledOnce()
    expect(parseLog(log.mock.calls[0]?.[0])).toEqual(
      expect.objectContaining({
        level: 'warn',
        event: 'api.request',
        endpoint: '/api/missing',
        status: 404,
        outcome: 'handled_error',
      }),
    )
  })

  it('logs thrown errors and returns a generic structured response', async () => {
    const secretMessage = 'Database password was rejected'
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    const handler = createApiRequestHandler(() => {
      throw new TypeError(secretMessage)
    })

    const response = await handler(new Request('http://localhost/api/failure?token=secret'))
    const payload: unknown = await response?.json()
    const requestId = response?.headers.get('x-request-id')
    const record = parseLog(log.mock.calls[0]?.[0])

    expect(response?.status).toBe(500)
    expect(payload).toEqual({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        requestId,
      },
    })
    expect(requestId).toEqual(expect.any(String))
    expect(record).toEqual(
      expect.objectContaining({
        level: 'error',
        event: 'api.request',
        endpoint: '/api/failure',
        status: 500,
        outcome: 'unhandled_error',
        requestId,
        error: expect.objectContaining({
          name: 'TypeError',
          message: secretMessage,
          stack: expect.any(String),
        }),
      }),
    )
    expect(JSON.stringify(payload)).not.toContain(secretMessage)
    expect(JSON.stringify(payload)).not.toContain('stack')
  })
})
