import { describe, expect, it } from 'vite-plus/test'

import { getExample } from './api/example.get'
import { getHealth } from './api/health.get'

describe('Nitro API routes', () => {
  it('returns health information', () => {
    expect(getHealth()).toEqual({ status: 'ok', service: 'vue-vite-ssr' })
  })

  it('returns the Nitro example payload with an ISO timestamp', () => {
    const response = getExample()

    expect(response.message).toBe('This response came from a Nitro API route.')
    expect(new Date(response.renderedAt).toISOString()).toBe(response.renderedAt)
  })
})
