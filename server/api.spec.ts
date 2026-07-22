import { describe, expect, it } from 'vite-plus/test'

import { handleApiRequest } from './api'

describe('handleApiRequest', () => {
  it('returns health information', async () => {
    const response = await handleApiRequest(new Request('http://localhost/api/health'))
    expect(response?.status).toBe(200)
    await expect(response?.json()).resolves.toEqual({ status: 'ok', service: 'vue-vite-ssr' })
  })

  it('ignores non-api requests and rejects unknown API routes', async () => {
    await expect(handleApiRequest(new Request('http://localhost/'))).resolves.toBeNull()
    const response = await handleApiRequest(new Request('http://localhost/api/missing'))
    expect(response?.status).toBe(404)
  })
})
