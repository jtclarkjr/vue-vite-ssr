import { describe, expect, it, vi } from 'vite-plus/test'

import { render } from './entry-server'

type FetchCall = (...arguments_: Parameters<typeof fetch>) => ReturnType<typeof fetch>

const fetchMock = Object.assign(
  vi.fn<FetchCall>(async (input) => {
    const requestUrl =
      input instanceof Request ? input.url : input instanceof URL ? input.href : input
    const pathname = new URL(requestUrl).pathname
    if (pathname === '/api/health') return Response.json({ status: 'ok', service: 'test' })
    return Response.json({ message: 'SSR data', renderedAt: '2026-01-01T00:00:00.000Z' })
  }),
  { preconnect: vi.fn<typeof fetch.preconnect>() },
)

describe('SSR render', () => {
  it('renders routes with isolated hydrated state', async () => {
    const first = await render('/', { origin: 'http://localhost', fetch: fetchMock })
    const second = await render('/about', { origin: 'http://localhost', fetch: fetchMock })
    const missing = await render('/definitely-missing', {
      origin: 'http://localhost',
      fetch: fetchMock,
    })

    expect(first.status).toBe(200)
    expect(first.html).toContain('Vue SSR with a Nitro server')
    expect(first.state.example).toBeDefined()
    expect(second.status).toBe(200)
    expect(second.state.example).toBeUndefined()
    expect(missing.status).toBe(404)
    expect(missing.html).toContain('Page not found')
  })
})
