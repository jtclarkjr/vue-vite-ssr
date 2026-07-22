import { describe, expect, it, vi } from 'vite-plus/test'

import { createApiClient } from './client'

describe('createApiClient', () => {
  it('parses typed JSON responses and combines headers', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ value: 42 }, { headers: { 'x-test': 'ok' } }))
    const client = createApiClient({
      baseUrl: 'https://example.test',
      fetch: fetchMock,
      defaultHeaders: { authorization: 'Bearer token' },
    })

    await expect(client.get<{ value: number }>('/api/value')).resolves.toEqual({ value: 42 })
    const [, options] = fetchMock.mock.calls[0] ?? []
    expect(new Headers(options?.headers).get('authorization')).toBe('Bearer token')
  })

  it('serializes JSON bodies and throws ApiError for failed responses', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ message: 'Invalid input' }, { status: 422 }))
    const client = createApiClient({ baseUrl: 'https://example.test', fetch: fetchMock })

    await expect(client.post('/api/value', { value: 1 })).rejects.toEqual(
      expect.objectContaining({ status: 422, message: 'Invalid input' }),
    )
  })

  it('parses structured server errors and exposes their correlation fields', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json(
        {
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
            requestId: 'request-123',
          },
        },
        { status: 500, headers: { 'x-request-id': 'request-123' } },
      ),
    )
    const client = createApiClient({ baseUrl: 'https://example.test', fetch: fetchMock })

    await expect(client.get('/api/value')).rejects.toEqual(
      expect.objectContaining({
        status: 500,
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        requestId: 'request-123',
      }),
    )
  })

  it('forwards abort signals', async () => {
    const controller = new AbortController()
    controller.abort()
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(controller.signal.reason)
    const client = createApiClient({ baseUrl: 'https://example.test', fetch: fetchMock })

    await expect(client.get('/api/value', { signal: controller.signal })).rejects.toBeDefined()
    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBe(controller.signal)
  })
})
