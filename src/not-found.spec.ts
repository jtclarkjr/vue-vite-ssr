// @vitest-environment node
import { Hono } from 'hono'
import type { CloudEnv } from 'void'
import { describe, expect, it } from 'vite-plus/test'

import notFoundMiddleware from '../middleware/99.not-found'
import { loader } from '../pages/[...path].server'

const app = new Hono<CloudEnv>()
app.use('*', notFoundMiddleware)
app.get('/known', (c) => c.text('Known page'))
app.get('/missing', async (c) => {
  await loader(c)
  if (c.req.header('X-VoidPages') === 'true') {
    return c.json({ component: '[...path].vue', props: {} }, 200, {
      'X-VoidPages': 'true',
      Vary: 'X-VoidPages',
    })
  }
  return c.html('<h1>Page not found</h1>', 200, { 'x-preserved': 'yes' })
})
app.get('/failed', (c) => {
  c.set('notFoundPage', true)
  return c.text('Existing error', 500)
})

describe('missing page status', () => {
  it('keeps rendered missing-page HTML and headers while returning 404', async () => {
    const response = await app.request('/missing')

    expect(response.status).toBe(404)
    expect(response.headers.get('x-preserved')).toBe('yes')
    expect(await response.text()).toBe('<h1>Page not found</h1>')
  })

  it('preserves the Pages response contract for client navigation', async () => {
    const response = await app.request('/missing', { headers: { 'X-VoidPages': 'true' } })

    expect(response.status).toBe(404)
    expect(response.headers.get('X-VoidPages')).toBe('true')
    expect(response.headers.get('vary')).toBe('X-VoidPages')
    expect(await response.json()).toEqual({ component: '[...path].vue', props: {} })
  })

  it('returns an empty body for HEAD', async () => {
    const response = await app.request('/missing', { method: 'HEAD' })

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('')
  })

  it('keeps the missing flag isolated to its request', async () => {
    await app.request('/missing')
    const response = await app.request('/known')

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('Known page')
  })

  it('preserves an existing error status', async () => {
    const response = await app.request('/failed')

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Existing error')
  })
})
