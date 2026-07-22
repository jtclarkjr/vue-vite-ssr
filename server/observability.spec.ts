import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { createUnhandledRequestResponse } from './observability'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('createUnhandledRequestResponse', () => {
  it('returns the structured API fallback contract', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    const response = createUnhandledRequestResponse(
      { method: 'POST', url: 'http://localhost/api/example?token=secret' },
      new Error('private detail'),
    )
    const payload: unknown = await response.json()
    const requestId = response.headers.get('x-request-id')

    expect(response.status).toBe(500)
    expect(requestId).toEqual(expect.any(String))
    expect(payload).toEqual({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        requestId,
      },
    })
    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toEqual(
      expect.objectContaining({
        event: 'api.request',
        method: 'POST',
        endpoint: '/api/example',
        status: 500,
        outcome: 'unhandled_error',
      }),
    )
  })

  it('keeps production responses generic and can expose development stacks', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('render failed')
    const productionResponse = createUnhandledRequestResponse(
      { method: 'GET', url: 'http://localhost/page' },
      error,
    )
    const developmentResponse = createUnhandledRequestResponse(
      { method: 'GET', url: 'http://localhost/page' },
      error,
      { exposeError: true },
    )

    await expect(productionResponse.text()).resolves.toBe('Internal server error')
    await expect(developmentResponse.text()).resolves.toContain('render failed')
    expect(productionResponse.headers.get('content-type')).toBe('text/plain; charset=utf-8')
  })
})
