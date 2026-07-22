import { defineHandler } from 'nitro'

import type { HealthResponse } from '../../src/api/types'

export const getHealth = (): HealthResponse => ({
  status: 'ok',
  service: 'vue-vite-ssr',
})

export default defineHandler(getHealth)
