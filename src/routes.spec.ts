// @vitest-environment node
import { Hono } from 'hono'
import type { CloudEnv } from 'void'
import { describe, expect, it } from 'vite-plus/test'

import apiNotFound from '../routes/api/[...path]'
import apiRootNotFound from '../routes/api/index'
import { GET as getExample } from '../routes/api/example'
import { GET as getHealth } from '../routes/api/health'

const app = new Hono<CloudEnv>()
app.get('/api/health', async (c) => Response.json(await getHealth(c)))
app.get('/api/example', async (c) => Response.json(await getExample(c)))
app.all('/api', async (c) => {
  const response = await apiRootNotFound(c)
  return response instanceof Response ? response : Response.json(response)
})
app.all('/api/*', async (c) => {
  const response = await apiNotFound(c)
  return response instanceof Response ? response : Response.json(response)
})

describe('Void API routes', () => {
  it('returns health JSON', async () => {
    const response = await app.request('/api/health')

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok', service: 'vue-vite-ssr' })
  })

  it('returns the example payload with an ISO timestamp', async () => {
    const response = await app.request('/api/example')
    const data: unknown = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      message: 'This response came from a Void API route.',
      renderedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    })
  })

  it.each(['/api', '/api/missing', '/api/deep/missing'])('keeps %s an API 404', async (path) => {
    const response = await app.request(path)

    expect(response.status).toBe(404)
    expect(response.headers.get('content-type')).toContain('application/json')
    expect(await response.json()).toEqual({ error: { message: 'Not Found' } })
  })

  it('keeps an unsupported API method out of the page renderer', async () => {
    const response = await app.request('/api/health', { method: 'POST' })

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: { message: 'Not Found' } })
  })
})
