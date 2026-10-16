// @vitest-environment node
import { Hono } from 'hono'
import type { CloudEnv } from 'void'
import { fetch } from 'void/client'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { loader } from '../pages/index.server'

vi.mock('void/client', () => ({ fetch: vi.fn<typeof fetch>() }))

const fetchMock = vi.mocked(fetch)
const app = new Hono<CloudEnv>()
app.get('/', async (c) => Response.json(await loader(c)))

describe('home page loader', () => {
  beforeEach(() => fetchMock.mockReset())

  it('loads both typed API responses as page props', async () => {
    const example = { message: 'Loaded on the server', renderedAt: '2026-01-01T00:00:00.000Z' }
    const health = { status: 'ok', service: 'test' }
    fetchMock.mockResolvedValueOnce(example).mockResolvedValueOnce(health)

    const response = await app.request('/')

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ example, health })
    expect(fetchMock.mock.calls.map(([path]) => path)).toEqual(['/api/example', '/api/health'])
  })

  it('loads fresh props for each request', async () => {
    fetchMock
      .mockResolvedValueOnce({ message: 'First request', renderedAt: '2026-01-01T00:00:00.000Z' })
      .mockResolvedValueOnce({ status: 'ok', service: 'first' })
      .mockResolvedValueOnce({ message: 'Second request', renderedAt: '2026-01-02T00:00:00.000Z' })
      .mockResolvedValueOnce({ status: 'ok', service: 'second' })

    const first = await app.request('/')
    const second = await app.request('/')

    expect(await first.json()).toMatchObject({ example: { message: 'First request' } })
    expect(await second.json()).toMatchObject({ example: { message: 'Second request' } })
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })
})
